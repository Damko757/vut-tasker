import type { Application, NextFunction, Request, Response } from "express";
import chalk from "chalk";
import HttpStatus from "http-status-codes";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(chalk.red(err));
    res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};

// export function loadErrorHandlers(app: Application) {
//     // catch 404 errors and forward to error handler
//     app.use((req, res, next) => {
//         interface BetterError extends Error {
//             status?: number;
//         }

//         const err: BetterError = new Error("Not Found");
//         err.status = 404;
//         next(err);
//     });

//     app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//         if (err.name === "ValidationError") {
//             res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
//                 errors: Object.keys(err.errors).reduce(function (
//                     errors: any,
//                     key: string
//                 ) {
//                     errors[key] = err.errors[key].message;

//                     return errors;
//                 },
//                 {}),
//             });

//             return;
//         }

//         console.error(chalk.red(err));
//         res.status(err.status || 500);
//         res.json({
//             errors: {
//                 message: err.message,
//                 error: err,
//             },
//         });
//     });
// }
