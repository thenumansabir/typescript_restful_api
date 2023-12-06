import { UserRole } from "./../models/userModels";
import { UserModel } from "../models/userModels";
import bcrypt from "bcrypt";
import pool from "../db";
import { Queries } from "../queries/queries";

export class UsersRepo {
  queries = new Queries();
  userRegistration(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const email: string = body.email;
        const password: string = body.password;
        const role: string = body.role;
        const status: string = "active";
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const user_exists = await pool.query(this.queries.checkUserExists, [
          email,
        ]);
        if (user_exists.rows && user_exists.rows.length > 0) {
          resolve(user_exists.rows);
        } else {
          const new_user = await pool.query(this.queries.addUser, [
            email,
            hashedPassword,
            status,
            role,
          ]);
          resolve(new_user.rows[0]);
        }
      } catch (error) {
        reject(error);
        console.log("Error regitering user: ", error);
        throw new Error("Could not register user");
      }
    });
  }

  userLogin(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const email: string = body.email;
        pool.query(this.queries.getUserForLogin, [email], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.rows[0]);
          }
        });
      } catch (error) {
        reject(error);
        console.log("Error logging user: ", error);
        throw new Error("Could not Login user");
      }
    });
  }

  // async getAllUsersFromDB() {
  //   try {
  //     const users = await UserModel.find({ role: "user" });
  //     return users;
  //   } catch (error) {
  //     console.log("Error fetching users: ", error);
  //     throw new Error("Could not fetch users");
  //   }
  // }

  // async getUserFromDB(id: any) {
  //   try {
  //     const user = await UserModel.find().and([{ _id: id }, { role: "user" }]);
  //     return user;
  //   } catch (error) {
  //     console.log("Error fetching user: ", error);
  //     throw new Error("Could not fetch user");
  //   }
  // }

  // async updateUserInDB(id: any, body: any) {
  //   try {
  //     const user_exists = await UserModel.find().and([
  //       { _id: id },
  //       { role: "user" },
  //     ]);
  //     if (user_exists.length !== 0) {
  //       if (body.password) {
  //         body.password = await bcrypt.hash(body.password, 10);
  //       }
  //       const user = await UserModel.findByIdAndUpdate(id, body, {
  //         new: true,
  //       });
  //       return user;
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     console.log("Error updating user: ", error);
  //     throw new Error("Could not update user");
  //   }
  // }

  // async deleteUserFromDB(id: any) {
  //   try {
  //     const user_exists = await UserModel.find().and([
  //       { _id: id },
  //       { role: "user" },
  //     ]);
  //     if (user_exists.length !== 0) {
  //       const user = await UserModel.findByIdAndDelete(id);
  //       return user;
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     console.log("Error deleting user: ", error);
  //     throw new Error("Could not delete user");
  //   }
  // }
}
