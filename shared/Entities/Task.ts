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
  completed_by: string[]; // nick[]
  created_by: string;
  rooms?: Record<string, string>; // nick: <roomNumber>
}
export enum TaskType {
  EXAM = "exam",
  PROJECT = "project",
  HOMEWORK = "homework",
  REGISTRATION = "registration",
  OTHER = "other",
}

export const taskTypeToColor: Record<TaskType, string> = {
  [TaskType.EXAM]: "orangered",
  [TaskType.PROJECT]: "dodgerblue",
  [TaskType.HOMEWORK]: "fuchsia",
  [TaskType.REGISTRATION]: "limegreen",
  [TaskType.OTHER]: "gold",
};

export function compareTasksByDueDate(a: Task, b: Task): -1 | 0 | 1 {
  const aDueDate = a.due_date ?? "";
  const bDueDate = b.due_date ?? "";

  if (aDueDate < bDueDate) return -1;
  if (aDueDate > bDueDate) return 1;

  const aDueDateEnd = a.due_date_end ?? "";
  const bDueDateEnd = b.due_date_end ?? "";
  if (aDueDateEnd < bDueDateEnd) return -1;
  if (aDueDateEnd > bDueDateEnd) return 1;
  return 0;
}
