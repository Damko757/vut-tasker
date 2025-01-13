import mongoose, { type ObjectId } from "mongoose";
import { TaskType, type Task as _Task } from "../../../shared/Entities/Task.ts";
import type { User } from "../../../shared/Entities/User.ts";

const taskTypes = [];
for (const taskType in TaskType) {
  if (isNaN(Number(taskType))) taskTypes.push(taskType.toLowerCase());
}

const TaskSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: {
      values: taskTypes,
      message: `Type '{VALUE}' is not in allowed types: ${taskTypes.join(
        ", "
      )}.`,
    },
  },
  required: {
    type: Boolean,
    default: true,
  },
  description: { type: String, required: false, default: null },
  due_date: { type: String, required: false, default: null },
  due_date_end: { type: String, required: false, default: null },
  personal: { type: Boolean, default: false },
  // registration_date_start: { type: String, required: false, default: null },
  // registration_date_end: { type: String, required: false, default: null },
  link: { type: String, required: false, default: null },
  completed_by: { type: [String], required: true },
  created_by: { type: String, required: true },
});

TaskSchema.pre("validate", function (next, ...args) {
  if (this.get("type")) this.set("type", this.get("type").toLowerCase());
  next();
});

export const TaskModel = mongoose.model<_Task>("Task", TaskSchema);
