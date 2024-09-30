import { Router } from "express";
import { TaskRouter } from "./TaskRouter.ts";

export const MainRouter = Router();

MainRouter.use("/task", TaskRouter);

MainRouter.use((req, res, next) => {
    console.log("!");
    return next(new Error("Invalid"));
});
