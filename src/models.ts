import mongoose, { Document } from "mongoose";

export interface Task {
  task_title: string;
  task_description: string;
  is_completed: boolean;
}

export interface TaskDocument extends Task, Document {}

const TaskSchema = new mongoose.Schema({
  task_title: { type: String, required: true },
  task_description: { type: String, required: true },
  is_completed: { type: Boolean, default: false },
});

export const TaskModel = mongoose.model<TaskDocument>("Task", TaskSchema);
