import mongoose from "mongoose";
import { ENV } from "./const.ts";
import chalk from "chalk";
import { UserModel } from "./Schemas/User.ts";
import { USERS } from "../../shared/config/users.ts";
export const initMongoose = async () => {
    return new Promise<void>((resolve, rejected) => {
        const connectString = `mongodb://${ENV.DATABASE_USER}:${ENV.DATABASE_PASSWORD}@${ENV.DATABASE_URI}:${ENV.DATABASE_PORT}`;
        // const connectString = `mongodb://root:root@mongodb:27017/test?authSource=admin`;

        mongoose
            .set("strictQuery", false)
            .connect(connectString)
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

                resolve();
            })
            .catch((err) => {
                console.error("Unable to connect to MongoDB!");
                rejected(err);
            });
    });
};
