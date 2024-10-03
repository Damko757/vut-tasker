import { TaskController } from "../Controllers/TaskController.ts";
import type { Routable } from "./Router.ts";

export const routableControllers: Routable[] = [new TaskController()];
