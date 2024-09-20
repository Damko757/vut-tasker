import * as dotenv from "dotenv";

const envConfig = dotenv.config().parsed ?? {};
console.log(envConfig);
export const ENV = {
    port: envConfig.API_PORT ?? 3000,
};
