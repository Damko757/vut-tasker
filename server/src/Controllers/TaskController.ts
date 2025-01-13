import mongoose, { type Error } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { Controller } from "./Controller.ts";
import { HttpStatusCodes } from "../Utils/HttpStatusCodes.ts";
import { TaskModel } from "../Schemas/Task.ts";
import chalk from "chalk";
import type { Task } from "../../../shared/Entities/Task.ts";
import { CookieValue } from "../Utils/Utils.ts";
import type { MiddlewareFunction } from "../Entities/MiddlewareFunction.ts";

export class TaskController
  extends Controller<typeof TaskModel>
  implements Routable
{
  routes() {
    const self = this;
    return {
      "/task/:id/:nick": {
        POST: this.addNick,
        DELETE: this.removeNick,
      },
      "/task/:id": {
        DELETE: this.deleteByTaskId,
        PUT: this.putByTaskId,
        PATCH: this.patchByTaskId,
      },
      "/tasks/:subject/:type": {
        GET: (...args: Parameters<MiddlewareFunction>) =>
          self.getByTaskSubjectAndType(...args),
      },
      "/tasks/:subject": {
        GET: (...args: Parameters<MiddlewareFunction>) =>
          self.getByTaskSubjectAndType(...args),
      },
      "/tasks": {
        GET: (...args: Parameters<MiddlewareFunction>) =>
          self.getAllTasks(...args),
        POST: this.postTask,
      },
    };
  }

  async addNick(req: Request, res: Response, next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCodes.NOT_FOUND);

    const completedBy = task?.completed_by ?? [];
    if (!completedBy?.includes(req.params.nick))
      completedBy.push(req.params.nick);

    res
      .status(HttpStatusCodes.OK)
      .send(
        await Controller.update(
          TaskModel,
          { _id: req.params.id },
          { completed_by: completedBy }
        )
      );
  }
  async removeNick(req: Request, res: Response, next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec(); //Should be session, but whatever;
    if (!task) return res.status(HttpStatusCodes.NOT_FOUND);

    const completedBy =
      task?.completed_by?.filter((n) => n != req.params.nick) ?? [];

    res
      .status(HttpStatusCodes.OK)
      .send(
        await Controller.update(
          TaskModel,
          { _id: req.params.id },
          { completed_by: completedBy }
        )
      );
  }

  async getByTaskSubjectAndType(
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
      .status(HttpStatusCodes.OK)
      .send(
        this.filterPersonalTasks(tasks, req.cookies[CookieValue.USER] ?? "")
      );
  }
  async deleteByTaskId(req: Request, res: Response, next: NextFunction) {
    const task = await TaskModel.findOne({ _id: req.params.id }).exec();
    if (!task) return res.status(HttpStatusCodes.NOT_FOUND).send();

    const result = await TaskModel.deleteOne({ _id: req.params.id }).exec();
    res.status(HttpStatusCodes.NO_CONTENT).send();
  }
  async postTask(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    req.body.created_by = req.cookies[CookieValue.USER] ?? "";
    const task = new TaskModel(req.body);
    console.log(task);

    return task
      .save()
      .catch((error) => {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send(error);
      })
      .then(async () => {
        return res.status(HttpStatusCodes.OK).send(task);
      });
  }
  getAllTasks(req: Request, res: Response, next: NextFunction) {
    const self = this;
    TaskModel.find().then((tasks) => {
      res
        .status(HttpStatusCodes.OK)
        .send(
          self.filterPersonalTasks(tasks, req.cookies[CookieValue.USER] ?? "")
        );
    });
  }

  patchByTaskId(req: Request, res: Response, next: NextFunction) {
    Controller.update(TaskModel, { _id: req.params.id }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCodes.OK).send(updated)
          : res.status(HttpStatusCodes.NOT_FOUND).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send(error);
      });
  }
  putByTaskId(req: Request, res: Response, next: NextFunction) {
    Controller.replace(TaskModel, { _id: req.params.id }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCodes.OK).send(updated)
          : res.status(HttpStatusCodes.NOT_FOUND).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send(error);
      });
  }

  filterPersonalTasks(tasks: Task[], nick: string): Task[] {
    return tasks.filter((task) => !task.personal || task.created_by == nick);
  }
}
