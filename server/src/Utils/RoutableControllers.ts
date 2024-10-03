import { TaskController } from "../Controllers/TaskController.ts";
import { UserController } from "../Controllers/UserController.ts";
import type { Routable } from "./Router.ts";

export const routableControllers: Routable[] = [
    new TaskController(),
    new UserController(),
];
