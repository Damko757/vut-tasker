import { serve } from "bun";
import { ENV } from "./const.ts";
import * as mongoose from "mongoose";
import chalk from "chalk";
import { Task } from "./Schemas/Task.ts";
import express from "express";
import { attachControllers } from "@decorators/express";
import { MainRouter } from "./Routes/index.ts";

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

app.use("/", MainRouter);

app.listen(ENV.SERVER_PORT);
