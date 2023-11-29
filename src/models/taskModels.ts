import mongoose, { Document } from "mongoose";

export interface Task {
  task_title: string;
  task_description: string;
  is_completed: boolean;
  user_id : string;
  files: string
}

export interface TaskDocument extends Task, Document {}

const TaskSchema = new mongoose.Schema({
  task_title: { type: String, required: true },
  task_description: { type: String, required: true },
  is_completed: { type: Boolean, default: false },
  user_id: { type: String, required: true },
  files: { type: Array},


});

export const TaskModel = mongoose.model<TaskDocument>("Task", TaskSchema);

// {
//   "task_title": "new! task",
//   "task_description": "string123",
//   "is_completed": false,
//   "user_id": "6548cb4e3bf3f4ed4046ec34"
// }