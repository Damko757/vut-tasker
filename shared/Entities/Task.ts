import type { date } from "../Utils.ts";
import type { User } from "./User.ts";

export interface Task {
    subject: string;
    type: TaskType;
    description: string;
    due_date: date | null;
    registration_data_start: date | null;
    registration_data_end: date | null;
    link: string | null;
    completed_by: User[];
}
export enum TaskType {
    PROJECT,
    HOMEWORK,
    BOOK,
}
