import chalk from "chalk";
import mongoose from "mongoose";
import { USERS } from "../../shared/config/users.ts";
import { ENV } from "./const.ts";
import { UserModel } from "./Schemas/User.ts";

export const initMongoose = async () => {
  return new Promise<void>((resolve, rejected) => {
    const connectString = `mongodb://${ENV.DATABASE_USER}:${ENV.DATABASE_PASSWORD}@${ENV.DATABASE_URI}/test?authSource=admin`;
    // const connectString = `mongodb://root:root@localhost/test?authSource=admin`;
    console.log(connectString);
    mongoose
      .set("strictQuery", false)
      .connect(connectString)
      .then(async () => {
        console.info(
          chalk.green(`Successfully connected to ${chalk.underline("Mongo")}!`),
        );

        UserModel.count().then((c) => {
          if (c == 0) {
            UserModel.insertMany(USERS).then(() => {
              console.log(chalk.yellow(`Inserted ${USERS.length} Users!`));
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
