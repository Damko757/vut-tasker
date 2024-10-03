import mongoose, { type ObjectId } from "mongoose";
import type { Task as _Task, TaskType } from "../../../shared/Entities/Task.ts";
import type { User } from "../../../shared/Entities/User.ts";

const TaskSchema = new mongoose.Schema<_Task & { _id: ObjectId }>({
    _id: { type: mongoose.Types.ObjectId },
    subject: { type: String, required: true },
    type: { type: String, required: true } as unknown as TaskType,
    description: { type: String, required: false },
    due_date: { type: String, required: false },
    registration_data_start: { type: String, required: false },
    registration_data_end: { type: String, required: false },
    link: { type: String, required: false },
    completed_by: { type: Array, required: true } as unknown as User[],
});

export const Task = mongoose.model("Task", TaskSchema);
