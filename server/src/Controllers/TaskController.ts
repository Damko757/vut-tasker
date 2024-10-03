import mongoose, { type Error } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { Controller } from "./Controller.ts";
import { HttpStatusCodes } from "../Utils/HttpStatusCodes.ts";
import { TaskModel } from "../Schemas/Task.ts";
import chalk from "chalk";

export class TaskController
    extends Controller<typeof TaskModel>
    implements Routable
{
    routes() {
        return {
            "/task/:id": {
                DELETE: this.deleteByTaskId,
                PUT: this.putByTaskId,
                PATCH: this.patchByTaskId,
            },
            "/task/:subject": {
                GET: this.getByTaskSubjectAndType,
            },
            "/task/:subject/:type": {
                GET: this.getByTaskSubjectAndType,
            },
            "/tasks": {
                GET: this.getAllTasks,
                POST: this.postTask,
            },
        };
    }

    async getByTaskSubjectAndType(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        console.log(req.params);
        const tasks = await TaskModel.find({
            subject: req.params.subject,
            ...(req.params.type ? { type: req.params.type } : {}),
        }).exec();

        return res.status(HttpStatusCodes.OK).send(tasks);
    }
    async deleteByTaskId(req: Request, res: Response, next: NextFunction) {
        const task = await TaskModel.findOne({ _id: req.params.id }).exec();
        if (!task) return res.status(HttpStatusCodes.NOT_FOUND).send();

        const result = await TaskModel.deleteOne({ _id: req.params.id }).exec();
        res.status(HttpStatusCodes.NO_CONTENT).send();
    }
    async postTask(req: Request, res: Response, next: NextFunction) {
        const task = new TaskModel(req.body);

        return task
            .save()
            .catch((error) => {
                return res
                    .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
                    .send(error);
            })
            .then(async () => {
                return res.status(HttpStatusCodes.OK).send(task);
            });
    }
    getAllTasks(req: Request, res: Response, next: NextFunction) {
        TaskModel.find().then((tasks) => {
            res.status(HttpStatusCodes.OK).send(tasks);
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
                return res
                    .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
                    .send(error);
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
                return res
                    .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
                    .send(error);
            });
    }
}
