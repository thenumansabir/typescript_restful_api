import { UserRole } from "./../models/userModels";
import { UserModel } from "../models/userModels";
import bcrypt from "bcrypt";
import pool from "../db";
import { Queries } from "../queries/queries";

const queries = new Queries();

export class UsersRepo {
  async userRegistration(body: any) {
    try {
      const email: string = body.email;
      const password: string = body.password;
      const status: string = body.status;
      const role: string = body.role;
      const hashedPassword: string = await bcrypt.hash(password, 10);

      pool.query(queries.checkUserExists, [email], (error, results) => {
        if (results && results.rows && results.rows.length > 0) {
          return null;
        } else {
          pool.query(
            queries.addUser,
            [email, hashedPassword, status, role],
            (error, results) => {
              if (error) throw error;
              return true;
            }
          );
        }
      });
    } catch (error) {
      console.log("Error resitering user: ", error);
      throw new Error("Could not register user");
    }
  }

  async userLogin(body: any) {
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

  async getAllUsersFromDB() {
    try {
      const users = await UserModel.find({ role: "user" });
      return users;
    } catch (error) {
      console.log("Error fetching users: ", error);
      throw new Error("Could not fetch users");
    }
  }

  async getUserFromDB(id: any) {
    try {
      const user = await UserModel.find().and([{ _id: id }, { role: "user" }]);
      return user;
    } catch (error) {
      console.log("Error fetching user: ", error);
      throw new Error("Could not fetch user");
    }
  }

  async updateUserInDB(id: any, body: any) {
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

  async deleteUserFromDB(id: any) {
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
