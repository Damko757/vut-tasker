import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import HttpStatus from "http-status-codes";
import { TaskModel } from "../Schemas/Task.ts";

export const TaskRouter = Router();

TaskRouter.get("/tasks", (req: Request, res: Response, _next: NextFunction) => {
  TaskModel.find({}).then((_tasks) => {
    res.json(req.body);

    res.send();
  });
});

TaskRouter.use((req: Request, res: Response, _next: NextFunction) => {
  if (req.method != "GET") res.status(HttpStatus.BAD_REQUEST).send({ lol: 5 });
});
