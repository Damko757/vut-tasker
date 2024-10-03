import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse } from "../Entities/ErrorResponse.ts";
import { HttpStatusCodes } from "./HttpStatusCodes.ts";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(chalk.red(err));

    const errorMsg: ErrorResponse = {
        message: "Could not complete request",
        error: err,
    };

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(errorMsg);
};
