import mongoose from "mongoose";
import { ENV } from "./const.ts";
import chalk from "chalk";
import { UserModel } from "./Schemas/User.ts";
import { USERS } from "../../shared/config/users.ts";
export const initMongoose = async () => {
    return mongoose
        .set("strictQuery", false)
        .connect(
            `mongodb://${ENV.DATABASE_USER}:${ENV.DATABASE_PASSWORD}@${ENV.DATABASE_URI}:${ENV.DATABASE_PORT}`
        )
        .then(async () => {
            console.info(
                chalk.green(
                    `Successfully connected to ${chalk.underline("Mongo")}!`
                )
            );

            UserModel.count().then((c) => {
                if (c == 0) {
                    UserModel.insertMany(USERS).then(() => {
                        console.log(
                            chalk.yellow(`Inserted ${USERS.length} Users!`)
                        );
                    });
                }
            });
        })
        .catch((err) => {
            console.error("Unable to connect to MongoDB!");
        });
};
