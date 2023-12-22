import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export interface User {
  _id: string;
  email: string;
  password: string;
  status: string;
  role: UserRole;
}

export interface UserDocument extends User, Document {
  _id: string;
}

const UserSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: "active" },
  role: { type: String, enum: Object.values(UserRole), required: true },
});

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
