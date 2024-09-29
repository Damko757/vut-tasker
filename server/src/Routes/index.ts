import { Router } from "express";
import { TaskRouter } from "./TaskRouter.ts";

export const MainRouter = Router();

MainRouter.use("/task", TaskRouter);
