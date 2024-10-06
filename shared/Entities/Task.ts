import type { date } from "../Utils.ts";

export interface Task {
    _id?: string;
    subject: string;
    type: TaskType;
    required: boolean;
    description: string;
    due_date: date | null;
    registration_date_start: date | null;
    registration_date_end: date | null;
    link: string | null;
    completed_by: string[]; // nicks
}
export enum TaskType {
    PROJECT,
    HOMEWORK,
    EXAM,
}
