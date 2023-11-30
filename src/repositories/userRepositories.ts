import { UserRole } from "./../models/userModels";
import { Response } from "express";
import { UserModel } from "../models/userModels";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config/config.services";

export class UsersRepo {
  async registerUserWithMongo(body: any) {
    try {
      const user_exists = await UserModel.findOne({
        email: body.email,
      });
      const email = body.email;
      const password = body.password;
      const hashedPassword = await bcrypt.hash(password, 10);

      if (!user_exists) {
        const user = await UserModel.create({
          email,
          password: hashedPassword,
          role:
            body.role.toLowerCase() === "admin"
              ? UserRole.Admin
              : body.role.toLowerCase() === "user"
              ? UserRole.User
              : UserRole.User,
        });
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error resitering user: ", error);
      throw new Error("Could not register user");
    }
  }

  async loginUserWithMongo(body: any) {
    try {
      const user: any = await UserModel.findOne({
        email: body.email,
      });
      if (user.status === "active") {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error resitering user: ", error);
      throw new Error("Could not register user");
    }
  }

  async getAllUsersWithMongo() {
    try {
      const users = await UserModel.find({ role: "user" });
      return users;
    } catch (error) {
      console.log("Error fetching users: ", error);
      throw new Error("Could not fetch users");
    }
  }

  async getUserWithMongo(id: any) {
    try {
      const user = await UserModel.find().and([{ _id: id }, { role: "user" }]);
      return user;
    } catch (error) {
      console.log("Error fetching user: ", error);
      throw new Error("Could not fetch user");
    }
  }

  async updateUserWithMongo(id: any, body: any) {
    try {
      const user_exists = await UserModel.find().and([
        { _id: id },
        { role: "user" },
      ]);
      if (user_exists.length !== 0) {
        if (body.password) {
          body.password = await bcrypt.hash(body.password, 10);
        }
        const user = await UserModel.findByIdAndUpdate(id, body, {
          new: true,
        });
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error updating user: ", error);
      throw new Error("Could not update user");
    }
  }

  async deleteUserWithMongo(id: any) {
    try {
      const user_exists = await UserModel.find().and([
        { _id: id },
        { role: "user" },
      ]);
      if (user_exists.length !== 0) {
        const user = await UserModel.findByIdAndDelete(id);
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error deleting user: ", error);
      throw new Error("Could not delete user");
    }
  }
}
