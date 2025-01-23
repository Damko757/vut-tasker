import type { date } from "../Utils.ts";

export interface Task {
  _id?: string;
  subject: string;
  type: TaskType;
  required: boolean;
  name: string;
  description: string;
  due_date: date | null;
  due_date_end: date | null;
  personal: boolean;
  link: string | null;
  completed_by: string[]; // nicks
  created_by: string;
}
export enum TaskType {
  PROJECT,
  HOMEWORK,
  EXAM,
  REGISTRATION,
}
