import { NextFunction, Router } from "express";
import { Task } from "../Schemas/Task.ts";
import { type Request, type Response } from "express";
import HttpStatus from "http-status-codes";

export const TaskRouter = Router();

TaskRouter.get("/tasks", (req: Request, res: Response, next: NextFunction) => {
    Task.find({}).then((tasks) => {
        res.json(req.body);

        res.send();
    });
});

TaskRouter.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method != "GET")
        res.status(HttpStatus.BAD_REQUEST).send({ lol: 5 });
});
