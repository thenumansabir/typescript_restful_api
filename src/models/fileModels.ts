import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface File {
  _id: string;
  task_id: string;
  file_name: string;
  file_type: string;
  file_ext: string;
  file_base64: string;
}

export interface FileDocument extends File, Document {
  _id: string;
}

const FileSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  task_id: { type: String },
  file_name: { type: String, required: true },
  file_type: { type: String, required: true },
  file_ext: { type: String, default: false },
  file_base64: { type: String, default: false },
});

export const FileModel = mongoose.model<FileDocument>("Files", FileSchema);
