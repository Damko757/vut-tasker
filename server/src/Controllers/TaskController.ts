import mongoose, { type Error } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { Controller } from "./Controller.ts";
import { TaskModel } from "../Schemas/Task.ts";
import chalk from "chalk";
import type { Task } from "../../../shared/Entities/Task.ts";
import { CookieValue } from "../Utils/Utils.ts";
import type { MiddlewareFunction } from "../Entities/MiddlewareFunction.ts";
import { HttpStatusCode } from "axios";

export class TaskController
  extends Controller<typeof TaskModel>
  implements Routable
{
  routes() {
    const self = this;
    return {
      "/task/:id/:nick": {
        POST: TaskController.addNick,
        DELETE: TaskController.removeNick,
      },
      "/task/:id": {
        DELETE: TaskController.deleteByTaskId,
        PUT: TaskController.putByTaskId,
        PATCH: TaskController.patchByTaskId,
      },
      "/task/:id/room/:nick": {
        POST: TaskController.addRoom,
        DELETE: TaskController.removeRoom,
      },
      "/tasks/:subject/:type": {
        GET: TaskController.getByTaskSubjectAndType,
      },
      "/tasks/:subject": {
        GET: TaskController.getByTaskSubjectAndType,
      },
      "/tasks": {
        GET: TaskController.getAllTasks,
        POST: TaskController.postTask,
      },
    };
  }

  static async addNick(req: Request, res: Response, next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCode.NotFound);

    const completedBy = task?.completed_by ?? [];
    if (!completedBy?.includes(req.params.nick))
      completedBy.push(req.params.nick);

    res
      .status(HttpStatusCode.Ok)
      .send(
        await Controller.update(
          TaskModel,
          { _id: req.params.id },
          { completed_by: completedBy }
        )
      );
  }
  static async removeNick(req: Request, res: Response, next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCode.NotFound);

    const completedBy =
      task?.completed_by?.filter((n) => n != req.params.nick) ?? [];

    res
      .status(HttpStatusCode.Ok)
      .send(
        await Controller.update(
          TaskModel,
          { _id: req.params.id },
          { completed_by: completedBy }
        )
      );
  }

  static async deleteByTaskId(req: Request, res: Response, next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec();
    if (!task) return res.status(HttpStatusCode.NotFound).send();

    const result = await TaskModel.deleteOne({ _id: req.params.id }).exec();
    res.status(HttpStatusCode.NoContent).send();
  }
  static async postTask(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    req.body.created_by = req.cookies[CookieValue.USER] ?? "";
    const task = new TaskModel(req.body);
    console.log(task);

    return task
      .save()
      .catch((error) => {
        return res.status(HttpStatusCode.UnprocessableEntity).send(error);
      })
      .then(async () => {
        return res.status(HttpStatusCode.Ok).send(task);
      });
  }
  static async getAllTasks(req: Request, res: Response, next: NextFunction) {
    const self = this;
    TaskModel.find().then((tasks) => {
      res
        .status(HttpStatusCode.Ok)
        .send(
          self.filterPersonalTasks(tasks, req.cookies[CookieValue.USER] ?? "")
        );
    });
  }

  static async addRoom(...[req, res, next]: Parameters<MiddlewareFunction>) {
    const nick = req.params.nick;

    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCode.NotFound);

    const newRooms = { ...task.rooms };
    newRooms[nick] = req.body.room;
    TaskModel.findByIdAndUpdate(task._id, {
      rooms: newRooms,
    })
      .exec()
      .then((task) => res.send(task))
      .catch(() => res.sendStatus(HttpStatusCode.InternalServerError));
  }
  static async removeRoom(
    ...[req, res, next]: Parameters<MiddlewareFunction>
  ) {}

  static async getByTaskSubjectAndType(
    req: Request,
    res: Response,
    next: NextFunction
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
          req.cookies[CookieValue.USER] ?? ""
        )
      );
  }
  static async patchByTaskId(req: Request, res: Response, next: NextFunction) {
    if (req.body.rooms)
      return res.status(HttpStatusCode.BadRequest).send({
        reason: "Rooms are patched by POST/DELETE /task/:id/room/:nick",
      }) as unknown as void;
    Controller.update(TaskModel, { _id: req.params.id }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCode.Ok).send(updated)
          : res.status(HttpStatusCode.NotFound).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCode.UnprocessableEntity).send(error);
      });
  }
  static async putByTaskId(req: Request, res: Response, next: NextFunction) {
    Controller.replace(TaskModel, { _id: req.params.id }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCode.Ok).send(updated)
          : res.status(HttpStatusCode.NotFound).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCode.UnprocessableEntity).send(error);
      });
  }

  static filterPersonalTasks(tasks: Task[], nick: string): Task[] {
    return tasks.filter((task) => !task.personal || task.created_by == nick);
  }
}
