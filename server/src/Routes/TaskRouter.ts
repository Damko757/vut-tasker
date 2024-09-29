import { Router } from "express";
import { Task } from "../Schemas/Task.ts";

export const TaskRouter = Router();

TaskRouter.get("/", (req, res, next) => {
    Task.find({}).then((tasks) => {
        res.json(tasks);

        next();
    });
});
