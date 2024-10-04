import type { NextFunction, Request, Response } from "express";
import type { MiddlewareFunction } from "../Entities/MiddlewareFunction.ts";
import { TaskModel } from "../Schemas/Task.ts";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { Controller } from "./Controller.ts";
import { HttpStatusCodes } from "../Utils/HttpStatusCodes.ts";

export class SubjectController
    extends Controller<typeof TaskModel>
    implements Routable
{
    routes() {
        const self = this;
        return {
            "/subjects": {
                GET: (...args: Parameters<MiddlewareFunction>) =>
                    self.getAllSubjects(...args),
            },
        };
    }

    async getAllSubjects(req: Request, res: Response, next: NextFunction) {
        return res
            .status(HttpStatusCodes.OK)
            .send(await TaskModel.find().distinct("subject").sort().exec());
    }
}
