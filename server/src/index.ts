import chalk from "chalk";
import { ENV } from "./const.ts";

import { initApp } from "./app.ts";
import { initMongoose } from "./initMongoose.ts";

Promise.all([initApp(), initMongoose()])
  .then(([app, _]) => {
    app.listen(ENV.SERVER_PORT).on("error", (e) => console.error(chalk.red(e)));
    console.log(
      chalk.blue(`Running at port ${chalk.underline(ENV.SERVER_PORT)}!`),
    );
  })
  .catch((err) => {
    console.error(err);
  });
