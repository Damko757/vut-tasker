import { serve } from "bun";
import { ENV } from "./const.ts";
import * as mongoose from "mongoose";
import chalk from "chalk";
import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import { MainRouter } from "./Routes/index.ts";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import type { ErrorResponse } from "./Entities/ErrorResponse.ts";
import { HttpStatusCodes } from "./Utils/HttpStatusCodes.ts";
import { Router } from "./Utils/Router.ts";
import { routableControllers } from "./Utils/RoutableControllers.ts";
import { errorHandler } from "./Utils/ErrorHandler.ts";

await mongoose
    .connect(
        `mongodb://${ENV.DATABASE_USER}:${ENV.DATABASE_PASSWORD}@${ENV.DATABASE_URI}:${ENV.DATABASE_PORT}`
    )
    .then(() => {
        console.info(
            chalk.green(
                `Successfully connected to ${chalk.underline("Mongo")}!`
            )
        );
    })
    .catch((err) => {
        console.error("Unable to connect to MongoDB!");
    });

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const router = new Router(routableControllers);
router.createRoutes(app);

app.use((req: Request, res: Response, next: NextFunction) => {
    const errorMsg: ErrorResponse = {
        message: `Unknown request: ${req.method} ${req.url}`,
    };

    res.status(HttpStatusCodes.BAD_REQUEST).send(errorMsg);
});

app.use(errorHandler);

app.listen(ENV.SERVER_PORT).on("error", (e) => console.error(chalk.red(e)));

console.log(chalk.blue(`Running at port ${chalk.underline(ENV.SERVER_PORT)}!`));
