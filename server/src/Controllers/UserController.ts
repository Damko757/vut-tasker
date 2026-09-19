import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../Schemas/User.ts";
import { HttpStatusCodes } from "../Utils/HttpStatusCodes.ts";
import type { Routable, RoutingMap } from "../Utils/Router.ts";
import { CookieValue } from "../Utils/Utils.ts";
import { Controller } from "./Controller.ts";

export class UserController
  extends Controller<typeof UserModel>
  implements Routable
{
  routes(): RoutingMap {
    return {
      "/users": {
        GET: (req, res, next) => this.getAllUsers(req, res, next),
        POST: (req, res, next) => this.postUser(req, res, next),
      },
      "/user": {
        GET: (req, res, next) => this.getUserByNick(req, res, next),
      },
      "/user/:nick": {
        GET: (req, res, next) => this.getUserByNick(req, res, next),
        PUT: (req, res, next) => this.putUserByNick(req, res, next),
        PATCH: (req, res, next) => this.patchUserByNick(req, res, next),
        DELETE: (req, res, next) => this.deleteUserByNick(req, res, next),
      },
      "/login/:nick": {
        POST: (req, res, _next) => this.loginUserByNick(req, res),
      },
      "/logoff": {
        POST: (req, res, _next) => this.logoff(req, res),
      },
    };
  }

  async logoff(_req: Request, res: Response) {
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

  async getAllUsers(_req: Request, res: Response, _next: NextFunction) {
    res.status(HttpStatusCodes.OK).send(await UserModel.find().exec());
  }

  async postUser(req: Request, res: Response, _next: NextFunction) {
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

  async getUserByNick(req: Request, res: Response, _next: NextFunction) {
    const user = await UserModel.findOne({
      nick: req.params.nick ?? req.cookies[CookieValue.USER] ?? "",
    }).exec();

    if (user) return res.send(user);
    return res.status(HttpStatusCodes.NOT_FOUND).send();
  }
  async putUserByNick(req: Request, res: Response, _next: NextFunction) {
    this.replace(UserModel, { nick: req.params.nick }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCodes.OK).send(updated)
          : res.status(HttpStatusCodes.NOT_FOUND).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send(error);
      });
  }
  async patchUserByNick(req: Request, res: Response, _next: NextFunction) {
    this.update(UserModel, { nick: req.params.nick }, req.body)
      .then((updated) => {
        return updated
          ? res.status(HttpStatusCodes.OK).send(updated)
          : res.status(HttpStatusCodes.NOT_FOUND).send();
      })
      .catch((error) => {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send(error);
      });
  }
  async deleteUserByNick(req: Request, res: Response, _next: NextFunction) {
    const result = await this.delete(UserModel, {
      nick: req.params.nick,
    });

    if (result) return res.status(HttpStatusCodes.NO_CONTENT).send();
    else return res.status(HttpStatusCodes.NOT_FOUND).send();
  }
}
