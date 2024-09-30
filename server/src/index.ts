import { serve } from "bun";
import { ENV } from "./const.ts";
import * as mongoose from "mongoose";
import chalk from "chalk";
import { Task } from "./Schemas/Task.ts";
import express from "express";
import { attachControllers } from "@decorators/express";
import { MainRouter } from "./Routes/index.ts";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/error-handler.ts";
import helmet from "helmet";
import cors from "cors";

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

app.use("/", MainRouter);

app.use(errorHandler);
app.listen(ENV.SERVER_PORT).on("error", (e) => console.error(chalk.red(e)));

console.log(chalk.blue(`Running at port ${chalk.underline(ENV.SERVER_PORT)}!`));
