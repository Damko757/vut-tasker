import chalk from "chalk";
import type { Application, NextFunction, Request, Response } from "express";
import type { HttpMethod } from "../Entities/HttpMethod.ts";
import type { MiddlewareFunction } from "../Entities/MiddlewareFunction.ts";
import { HttpStatusCodes } from "./HttpStatusCodes.ts";
import type { ErrorResponse } from "../Entities/ErrorResponse.ts";

export class Router {
    routables: Routable[];
    routingMap: RoutingMap;

    constructor(routables: Routable[]) {
        this.routables = routables;
        this.routingMap = {};
    }

    createRoutes(app: Application) {
        const handleRequest = this.handleRequest;

        this.routables.forEach((routable) => {
            const routes = routable.routes();

            const paths: string[][] = [];

            for (const path in routes) {
                paths.push(path.split("/"));
            }

            //Sorting by url length
            paths
                .sort((a: string[], b: string[]) => {
                    if (a.length > b.length) return -1;
                    if (a.length < b.length) return 1;

                    return 0;
                })
                .forEach((_path) => {
                    const path = _path.join("/");
                    app.use(path, function (...args) {
                        handleRequest(routes[path], ...args);
                    });
                });
        });
    }

    handleRequest(
        methods: RoutingMapMethod,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (req.method in methods) {
            const callback = methods[req.method as HttpMethod]!;
            return callback(req, res, next);
        }

        const errorResponse: ErrorResponse = {
            message: `Invalid method: ${req.method}`,
            detail: `Accepted methods are: ${Object.keys(methods).join(", ")}`,
        };

        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", "*");

        // Request methods you wish to allow
        res.setHeader(
            "Access-Control-Allow-Methods",
            Object.keys(methods).join(", ")
        );

        // Request headers you wish to allow
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With,content-type"
        );

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", 1);
        res.status(HttpStatusCodes.BAD_REQUEST).send(errorResponse);
    }
}

export interface Routable {
    routes: () => RoutingMap;
}

export interface RoutingMap {
    [url: string]: RoutingMapMethod;
}

export type RoutingMapMethod = {
    [method in HttpMethod]?: MiddlewareFunction;
};
