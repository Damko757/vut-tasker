import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../Schemas/User.ts";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { Controller } from "./Controller.ts";
import { HttpStatusCodes } from "../Utils/HttpStatusCodes.ts";
import type { MiddlewareFunction } from "../Entities/MiddlewareFunction.ts";
import { TaskModel } from "../Schemas/Task.ts";
import { CookieValue } from "../Utils/Utils.ts";
import { ENV } from "../const.ts";

export class UserController
  extends Controller<typeof UserModel>
  implements Routable
{
  routes() {
    return {
      "/users": {
        GET: this.getAllUsers,
        POST: this.postUser,
      },
      "/user": {
        GET: this.getUserByNick,
      },
      "/user/:nick": {
        GET: this.getUserByNick,
        PUT: this.putUserByNick,
        PATCH: this.patchUserByNick,
        DELETE: this.deleteUserByNick,
      },
      "/login/:nick": {
        POST: this.loginUserByNick,
      },
      "/logoff": {
        POST: this.logoff,
      },
    };
  }

  async logoff(req: Request, res: Response) {
    res.clearCookie(CookieValue.USER);
  }

  async loginUserByNick(req: Request, res: Response) {
    const nick = req.params.nick ?? null;
    const user = await UserModel.findOne({ nick: req.params.nick }).exec();
    if (!user) return res.status(HttpStatusCodes.NOT_FOUND).send();

    res.cookie(CookieValue.USER, nick, {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 3600 * 1000,
      sameSite: "none",
      expires: (function (d = new Date()) {
        d.setDate(d.getDate() + 365);
        return d;
      })(),
      partitioned: true,
    });
    res.status(HttpStatusCodes.OK).send(user);
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCodes.OK).send(await UserModel.find().exec());
  }

  async postUser(req: Request, res: Response, next: NextFunction) {
    const user = new UserModel(req.body);

    return user
      .save()
      .catch((error) => {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send(error);
      })
      .then(async () => {
        return res.status(HttpStatusCodes.OK).send(user);
      });
  }

  async getUserByNick(req: Request, res: Response, next: NextFunction) {
    const user = await UserModel.findOne({
      nick: req.params.nick ?? req.cookies[CookieValue.USER] ?? "",
    }).exec();

    if (user) return res.send(user);
    return res.status(HttpStatusCodes.NOT_FOUND).send();
  }
  async putUserByNick(req: Request, res: Response, next: NextFunction) {
    Controller.replace(UserModel, { nick: req.params.nick }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCodes.OK).send(updated)
          : res.status(HttpStatusCodes.NOT_FOUND).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send(error);
      });
  }
  async patchUserByNick(req: Request, res: Response, next: NextFunction) {
    Controller.update(UserModel, { nick: req.params.nick }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCodes.OK).send(updated)
          : res.status(HttpStatusCodes.NOT_FOUND).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send(error);
      });
  }
  async deleteUserByNick(req: Request, res: Response, next: NextFunction) {
    const result = await Controller.delete(UserModel, {
      nick: req.params.nick,
    });

    if (result) return res.status(HttpStatusCodes.NO_CONTENT).send();
    else return res.status(HttpStatusCodes.NOT_FOUND).send();
  }
}
