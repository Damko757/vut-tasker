import type { NextFunction, Request, Response } from "express";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { Controller } from "./Controller.ts";
import { HttpStatusCodes } from "../Utils/HttpStatusCodes.ts";

export class TaskController extends Controller implements Routable {
    routes() {
        return {
            "/task/:id/:x": {
                GET: this.getAll,
            },
            "/task/:id": {
                GET: this.getById,
                PUT: this.putById,
            },
        };
    }

    getById(req: Request, res: Response, next: NextFunction) {
        console.log("GET!");

        res.status(HttpStatusCodes.NOT_IMPLEMENTED).send("GET");
    }
    putById(req: Request, res: Response, next: NextFunction) {
        console.log("PUT!");

        res.status(HttpStatusCodes.NOT_IMPLEMENTED).send("PUT");
    }
    getAll(req: Request, res: Response, next: NextFunction) {
        console.log("GET ALL!");

        res.status(HttpStatusCodes.NOT_IMPLEMENTED).send("GET ALL");
    }
}
