import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import type { ErrorResponse } from "./Entities/ErrorResponse.ts";
import { HttpStatusCodes } from "./Utils/HttpStatusCodes.ts";
import { Router } from "./Utils/Router.ts";
import { routableControllers } from "./Utils/RoutableControllers.ts";
import { errorHandler } from "./Utils/ErrorHandler.ts";
import { ENV } from "./const.ts";

export const initApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: ENV.WEB_URL,
      credentials: true,
    })
  );
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

  return app;
};
