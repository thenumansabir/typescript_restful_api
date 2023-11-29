import mongoose, { Document } from "mongoose";

export interface Files {
  file_name: string;
  file_type: string;
  file_ext: string;
  task_id: string;
}

export interface FileDocument extends Files, Document {}

const FileSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_type: { type: String, required: true },
  file_ext: { type: String, default: false },
  task_id: { type: String, required: true },
});

export const FilesModel = mongoose.model<FileDocument>("Files", FileSchema);
