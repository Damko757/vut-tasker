import * as dotenv from "dotenv";

export const ENV =
    dotenv.config({ path: __dirname + "/./../../.env" }).parsed ?? {};
