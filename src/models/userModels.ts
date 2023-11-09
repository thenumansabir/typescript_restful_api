import mongoose, { Document } from "mongoose";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export interface User {
  email: string;
  password: string;
  status: string;
  role: UserRole;
}

export interface UserDocument extends User, Document {}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: "active" },
  role: { type: String, enum: Object.values(UserRole), required: true },
});

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
