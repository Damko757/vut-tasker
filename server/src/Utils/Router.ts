import type { Application, NextFunction, Request, Response } from "express";
import type { HttpMethod } from "../Entities/HttpMethod.ts";
import type { MiddlewareFunction } from "../Entities/MiddlewareFunction.ts";
import { HttpStatusCodes } from "./HttpStatusCodes.ts";
import type { ErrorResponse } from "../Entities/ErrorResponse.ts";
import chalk from "chalk";

export class Router {
    routables: Routable[];
    routingMap: RoutingMap;

    allowedRouteMethods!: {
        [url: string]: HttpMethod[];
    };

    constructor(routables: Routable[]) {
        this.routables = routables;
        this.routingMap = {};
    }

    createRoutes(app: Application) {
        const handleInvalidMethod = this.handleInvalidMethod;
        const self = this;

        this.routingMap = {};

        this.routables.forEach((routable) => {
            const allRoutes = routable.routes();
            self.routingMap = { ...self.routingMap, ...allRoutes };

            const paths: string[][] = [];

            this.allowedRouteMethods = {};

            for (const path in allRoutes) {
                const parts = path.split("/");

                paths.push(parts);

                const newPath = parts
                    .map((v, i) => (v[0] == ":" ? `:${i}` : v))
                    .join("/");
                if (!(newPath in this.allowedRouteMethods)) {
                    this.allowedRouteMethods[newPath] = [];
                }

                this.allowedRouteMethods[newPath] = [
                    ...this.allowedRouteMethods[newPath],
                    ...(Object.keys(allRoutes[path]) as HttpMethod[]),
                ];
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

                    for (const method in allRoutes[path]) {
                        app[method.toLowerCase() as keyof typeof app](
                            path,
                            allRoutes[path][
                                method as keyof (typeof allRoutes)["path"]
                            ] as MiddlewareFunction
                        );
                    }

                    // app.use(path, function (...args) {
                    //     handleRequest(routes[path], ...args);
                    // });
                });

            for (const path in this.allowedRouteMethods) {
                app.use(path, (...args: Parameters<MiddlewareFunction>) =>
                    self.handleInvalidMethod(path, ...args)
                );
            }
        });
        console.log(chalk.cyan("Routes:"));
        console.log(this.routingMap);
    }

    handleInvalidMethod(
        matchedPath: string,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const methods = this.allowedRouteMethods[matchedPath];
        methods.sort();

        const errorResponse: ErrorResponse = {
            message: `Invalid method: ${req.method}`,
            detail: `Accepted methods are: ${methods.join(", ")}`,
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
