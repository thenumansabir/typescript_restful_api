import mongoose, { Document } from "mongoose";

export interface File {
  // file_name: string;
  // file_type: string;
  // file_ext: string;
  // task_id: string;
  upload_file: String;
}

export interface FileDocument extends File, Document {}

const FileSchema = new mongoose.Schema({
  // file_name: { type: String, required: true },
  // file_type: { type: String, required: true },
  // file_ext: { type: String, default: false },
  // task_id: { type: String, required: true },
  upload_file: { type: String, required: true },
});

export const FileModel = mongoose.model<FileDocument>("Files", FileSchema);
