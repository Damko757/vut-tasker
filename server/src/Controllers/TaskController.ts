import { HttpStatusCode } from "axios";
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Task } from "../../../shared/Entities/Task.ts";
import type { MiddlewareFunction } from "../Entities/MiddlewareFunction.ts";
import { TaskModel } from "../Schemas/Task.ts";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { CookieValue } from "../Utils/Utils.ts";
import { Controller } from "./Controller.ts";

export class TaskController
  extends Controller<typeof TaskModel>
  implements Routable
{
  routes(): RoutingMap {
    return {
      "/task/:id/:nick": {
        POST: (req, res, next) => this.addNick(req, res, next),
        DELETE: (req, res, next) => this.removeNick(req, res, next),
      },
      "/task/:id": {
        DELETE: (req, res, next) => this.deleteByTaskId(req, res, next),
        PUT: (req, res, next) => this.putByTaskId(req, res, next),
        PATCH: (req, res, next) => this.patchByTaskId(req, res, next),
        GET: (req, res, next) => this.getTaskById(req, res, next),
      },
      "/task/:id/room/:nick": {
        POST: (req, res, next) => this.addRoom(req, res, next),
        DELETE: (req, res, next) => this.removeRoom(req, res, next),
      },
      "/tasks/:subject/:type": {
        GET: (req, res, next) => this.getByTaskSubjectAndType(req, res, next),
      },
      "/tasks/:subject": {
        GET: (req, res, next) => this.getByTaskSubjectAndType(req, res, next),
      },
      "/tasks": {
        GET: (req, res, next) => this.getAllTasks(req, res, next),
        POST: (req, res, next) => this.postTask(req, res, next),
      },
    };
  }

  async addNick(req: Request, res: Response, _next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCode.NotFound);

    const completedBy = task?.completed_by ?? [];
    if (!completedBy?.includes(req.params.nick as string))
      completedBy.push(req.params.nick as string);

    res
      .status(HttpStatusCode.Ok)
      .send(
        await this.update(
          TaskModel,
          { _id: req.params.id },
          { completed_by: completedBy },
        ),
      );
  }
  async removeNick(req: Request, res: Response, _next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCode.NotFound);

    const completedBy =
      task?.completed_by?.filter((n) => n != req.params.nick) ?? [];

    res
      .status(HttpStatusCode.Ok)
      .send(
        await this.update(
          TaskModel,
          { _id: req.params.id },
          { completed_by: completedBy },
        ),
      );
  }

  async deleteByTaskId(req: Request, res: Response, _next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec();
    if (!task) return res.status(HttpStatusCode.NotFound).send();

    await TaskModel.findByIdAndDelete(req.params.id).exec();
    res.status(HttpStatusCode.NoContent).send();
  }
  async postTask(req: Request, res: Response, _next: NextFunction) {
    req.body.created_by =
      req.body.created_by ?? req.cookies[CookieValue.USER] ?? "";
    const task = new TaskModel(req.body);

    return task
      .save()
      .then(async () => {
        return res.status(HttpStatusCode.Ok).send(task);
      })
      .catch((error) => {
        return res.status(HttpStatusCode.UnprocessableEntity).send(error);
      });
  }
  /**
   * Fetches all tasks
   * @query subjects - Semicolon splitted subjects to include
   */
  async getAllTasks(req: Request, res: Response, _next: NextFunction) {
    const filter: mongoose.FilterQuery<Task> = {}; // Generic filter

    // If subjects defined, filter by semicolon divided values
    if (req.query.subjects) {
      filter.subject = { $in: (req.query.subjects as string).split(";") };
    }

    TaskModel.find(filter).then((tasks) => {
      res
        .status(HttpStatusCode.Ok)
        .send(
          TaskController.filterPersonalTasks(
            tasks,
            req.cookies[CookieValue.USER] ?? "",
          ),
        );
    });
  }
  async getTaskById(req: Request, res: Response, _next: NextFunction) {
    TaskModel.findById(req.params.id)
      .then((task) => {
        if (task) res.send(task);
        else res.sendStatus(HttpStatusCode.NotFound);
      })
      .catch(() => res.sendStatus(HttpStatusCode.NotFound));
  }

  async addRoom(...[req, res, _next]: Parameters<MiddlewareFunction>) {
    const nick = req.params.nick as string;

    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCode.NotFound);

    const newRooms = { ...task.rooms };
    newRooms[nick] = req.body.room;
    TaskModel.findByIdAndUpdate(task._id, {
      rooms: newRooms,
    })
      .exec()
      .then(async (_) => res.send(await TaskModel.findById(task._id).exec()))
      .catch(() => res.sendStatus(HttpStatusCode.InternalServerError));
  }
  async removeRoom(...[req, res, _next]: Parameters<MiddlewareFunction>) {
    const nick = req.params.nick as string;

    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCode.NotFound);

    const newRooms = { ...task.rooms };
    delete newRooms[nick];
    TaskModel.findByIdAndUpdate(task._id, {
      rooms: newRooms,
    })
      .exec()
      .then(async (_) => res.send(await TaskModel.findById(task._id).exec()))
      .catch(() => res.sendStatus(HttpStatusCode.InternalServerError));
  }

  async getByTaskSubjectAndType(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const tasks = await TaskModel.find({
      subject: req.params.subject,
      ...(req.params.type ? { type: req.params.type } : {}),
    })
      .sort({
        type: 1,
      })
      .exec();

    return res
      .status(HttpStatusCode.Ok)
      .send(
        TaskController.filterPersonalTasks(
          tasks,
          req.cookies[CookieValue.USER] ?? "",
        ),
      );
  }
  async patchByTaskId(req: Request, res: Response, _next: NextFunction) {
    if (req.body.rooms)
      return res.status(HttpStatusCode.BadRequest).send({
        reason: "Rooms are patched by POST/DELETE /task/:id/room/:nick",
      }) as unknown as void;
    if (req.body.completed_by)
      return res.status(HttpStatusCode.BadRequest).send({
        reason: "Completed-by are patched by POST/DELETE /task/:id/:nick",
      }) as unknown as void;

    this.update(TaskModel, { _id: req.params.id }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCode.Ok).send(updated)
          : res.status(HttpStatusCode.NotFound).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCode.UnprocessableContent).send(error);
      });
  }
  async putByTaskId(req: Request, res: Response, _next: NextFunction) {
    this.replace(TaskModel, { _id: req.params.id }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCode.Ok).send(updated)
          : res.status(HttpStatusCode.NotFound).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCode.UnprocessableContent).send(error);
      });
  }

  static filterPersonalTasks(tasks: Task[], nick: string): Task[] {
    return tasks.filter((task) => !task.personal || task.created_by == nick);
  }
}
