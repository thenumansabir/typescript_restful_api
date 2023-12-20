import { UserRole } from "../../models/userModels";
import { UserModel } from "../../models/userModels";
import { IUsersRepo } from "./IUserRepo";
import bcrypt from "bcrypt";

export class UsersRepoMongo implements IUsersRepo {
  userRegistration(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
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
          resolve(false);
        } else {
          resolve(user_exists);
        }
      } catch (error) {
        reject(error);
        console.log("Error resitering user: ", error);
        throw new Error("Could not register user");
      }
    });
  }

  userLogin(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await UserModel.findOne({
          email: body.email,
        });
        if (user && user.status === "active") {
          resolve(user);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
        console.log("Error resitering user: ", error);
        throw new Error("Could not register user");
      }
    });
  }

  getAllUsersFromDB(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await UserModel.find({ role: "user" });
        resolve(users);
      } catch (error) {
        reject(error);
        console.log("Error fetching users: ", error);
        throw new Error("Could not fetch users");
      }
    });
  }

 getUserFromDB(id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.find().and([
          { _id: id },
          { role: "user" },
        ]);
        resolve(user);
      } catch (error) {
        reject(error);
        console.log("Error fetching user: ", error);
        throw new Error("Could not fetch user");
      }
    });
  }

  updateUserInDB(id: any, body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
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
          resolve(user);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
        console.log("Error updating user: ", error);
        throw new Error("Could not update user");
      }
    });
  }

  deleteUserFromDB(id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user_exists = await UserModel.find().and([
          { _id: id },
          { role: "user" },
        ]);
        if (user_exists && user_exists.length !== 0) {
          const user = await UserModel.findByIdAndDelete(id);
          resolve(user);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
        console.log("Error deleting user: ", error);
        throw new Error("Could not delete user");
      }
    });
  }
}
