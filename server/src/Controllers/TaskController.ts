import type { NextFunction, Request, Response } from "express";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { Controller } from "./Controller.ts";
import { HttpStatusCodes } from "../Utils/HttpStatusCodes.ts";
import { Task } from "../Schemas/Task.ts";

export class TaskController extends Controller implements Routable {
    routes() {
        return {
            "/task/:id": {
                GET: this.getByTaskId,
                DELETE: this.deleteByTaskId,
            },
            "/tasks": {
                GET: this.getAllTasks,
                POST: this.postTask,
            },
        };
    }

    getByTaskId(req: Request, res: Response, next: NextFunction) {
        console.log("GET!");
        // TODO

        res.status(HttpStatusCodes.NOT_IMPLEMENTED).send("GET");
    }
    async deleteByTaskId(req: Request, res: Response, next: NextFunction) {
        const task = await Task.findOne({ _id: req.params.id }).exec();
        if (!task) return res.status(HttpStatusCodes.NOT_FOUND).send();

        const result = await Task.deleteOne({ _id: req.params.id }).exec();
        res.status(HttpStatusCodes.NO_CONTENT).send();
    }
    postTask(req: Request, res: Response, next: NextFunction) {
        // TODO

        res.status(HttpStatusCodes.NOT_IMPLEMENTED).send("POST");
    }
    getAllTasks(req: Request, res: Response, next: NextFunction) {
        Task.find().then((tasks) => {
            res.status(HttpStatusCodes.OK).send(tasks);
        });
    }
}
