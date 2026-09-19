import type { NextFunction, Request, Response } from "express";
import type { MiddlewareFunction } from "../Entities/MiddlewareFunction.ts";
import { TaskModel } from "../Schemas/Task.ts";
import { HttpStatusCodes } from "../Utils/HttpStatusCodes.ts";
import type { Routable } from "../Utils/Router.ts";
import { Controller } from "./Controller.ts";

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

  async getAllSubjects(_req: Request, res: Response, _next: NextFunction) {
    return res
      .status(HttpStatusCodes.OK)
      .send(await TaskModel.find().distinct("subject").sort().exec());
  }
}
