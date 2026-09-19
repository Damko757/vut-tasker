import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import fs from "fs/promises";
import helmet from "helmet";
import { ENV } from "./const.ts";
import type { ErrorResponse } from "./Entities/ErrorResponse.ts";
import type { HttpMethod } from "./Entities/HttpMethod.ts";
import type { MiddlewareFunction } from "./Entities/MiddlewareFunction.ts";
import { errorHandler } from "./Utils/ErrorHandler.ts";
import { HttpStatusCodes } from "./Utils/HttpStatusCodes.ts";
import { routableControllers } from "./Utils/RoutableControllers.ts";
import { Router } from "./Utils/Router.ts";
import { CookieValue } from "./Utils/Utils.ts";

const requestStatistics: {
  [key: string]: Record<HttpMethod, number>;
} = {};

export const initApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: ENV.WEB_URL,
      credentials: true,
    }),
  );
  app.use(bodyParser.json());
  app.use(cookieParser());

  // Logs what user made how many requests
  app.use((...[req, _res, next]: Parameters<MiddlewareFunction>) => {
    const nick = req.cookies[CookieValue.USER];
    if (!nick || ENV.PROD != "1") return next();

    new Promise<void>(async (resolve, _reject) => {
      if (!(nick in requestStatistics))
        requestStatistics[nick] = {
          GET: 0,
          POST: 0,
          DELETE: 0,
          OPTIONS: 0,
          PATCH: 0,
          PUT: 0,
        };

      requestStatistics[nick][req.method.toUpperCase() as HttpMethod]++;

      await fs.writeFile("./traffic.log", JSON.stringify(requestStatistics));
      resolve();
    });

    next();
  });

  const router = new Router(routableControllers);
  router.createRoutes(app);

  app.use((req: Request, res: Response, _next: NextFunction) => {
    const errorMsg: ErrorResponse = {
      message: `Unknown request: ${req.method} ${req.url}`,
    };

    res.status(HttpStatusCodes.BAD_REQUEST).send(errorMsg);
  });

  app.use(errorHandler);

  return app;
};
