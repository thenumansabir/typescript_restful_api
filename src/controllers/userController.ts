import { Request, Response } from "express";
import { UsersRepoMongo } from "../repositories/user/userRepoMongo";
import { UsersRepoPG } from "../repositories/user/userRepoPG";
import { UsersRepoPrisma } from "../repositories/user/userRepoPrisma";
import { IUsersRepo } from "./../repositories/user/IUserRepo";
import { ValidationError, DatabaseError } from "../utils/errorHandlers";
import { JWT_SECRET } from "../config/config.services";
import { validate as isUUID } from "uuid";
import { emailRegex, passwordRegex } from "../utils/regex";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserController {
  private myUser: IUsersRepo;
  constructor(userRepo: IUsersRepo) {
    this.myUser = userRepo;
  }

  // ************** Register User **************
  registerUser = async (req: Request, res: Response) => {
    try {
      if (!req.body.email && !req.body.password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      } else if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      } else if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
          error:
            "Pssword must contain at least one uppercase, lovercase,digit, special character and must be 8 characters long",
        });
      } else {
        const user = await this.myUser.userRegistration(req.body);
        if (user) {
          return res.status(409).json({ error: "User already exists" });
        } else {
          res.status(201).json({
            message: "User registered successfully.",
          });
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  // ************** Login User **************
  loginUser = async (req: Request, res: Response) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      } else if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      } else if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
          error:
            "Pssword must contain at least one uppercase, lovercase,digit, special character and must be 8 characters long",
        });
      } else {
        const user = await this.myUser.userLogin(req.body);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        } else {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "An unexpected error occurred" });
            }

            if (result) {
              const id: any = user._id ? "_id" : "id";
              const token = jwt.sign(
                { email: user.email, user_id: user.id, role: user.role },
                JWT_SECRET,
                {
                  expiresIn: "1h",
                }
              );
              return res
                .status(201)
                .json({ message: "User login successfully", token: token });
            }

            return res.status(401).json({ error: "Incorrect Password" });
          });
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  // ************** Get All Users (Only Admin can) **************
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      if (role === "admin") {
        const users: any = await this.myUser.getAllUsersFromDB();
        if (!users) {
          res.status(404).json({ error: "No user found" });
        } else {
          res.status(200).json(users);
        }
      } else if (role === "user") {
        res.status(400).json({ error: "user can not get users." });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  // ************** Get Single User (Only Admin can) **************
  getUser = async (req: Request, res: Response) => {
    try {
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      const isValidUUID: boolean = isUUID(req.params.id);
      if (isValidUUID) {
        if (role === "admin") {
          const user = await this.myUser.getUserFromDB(req.params.id);
          if (!user || user === null || user.length === 0) {
            res.status(404).json({ error: "No user found" });
          } else {
            res.status(200).json(user);
          }
        } else if (role === "user") {
          res.status(400).json({ error: "user can not get user." });
        }
      } else {
        res.status(403).json({ error: "id must be UUID" });
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  // ************** Update User (Only Admin can) **************
  updateUser = async (req: Request, res: Response) => {
    try {
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      const isValidUUID: boolean = isUUID(req.params.id);
      if (isValidUUID) {
        if (role === "admin") {
          const user = await this.myUser.updateUserInDB(
            req.params.id,
            req.body
          );
          if (!user) {
            res.status(404).json({ error: "No user found" });
          } else {
            res.status(200).json({ message: "User successfully updated." });
          }
        } else if (role === "user") {
          res.status(400).json({ error: "user can not update user." });
        }
      } else {
        res.status(403).json({ error: "id must be UUID" });
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  // ************** Delete User (Only Admin can) **************
  deleteUser = async (req: Request, res: Response) => {
    try {
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      const isValidUUID: boolean = isUUID(req.params.id);
      if (isValidUUID) {
        if (role === "admin") {
          const user = await this.myUser.deleteUserFromDB(req.params.id);
          if (!user || user === null || user.length === 0) {
            res.status(404).json({ error: "No user found" });
          } else {
            res.status(200).json({ message: "User deleted successfully" });
          }
        } else if (role === "user") {
          res.status(400).json({ error: "user can not delete user." });
        }
      } else {
        res.status(403).json({ error: "id must be UUID" });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };
}

export default new UserController(
  process.env.DATABASE_TYPE == "mongoDB"
    ? new UsersRepoMongo()
    : process.env.DATABASE_TYPE == "postgreSQL"
    ? new UsersRepoPG()
    : new UsersRepoPrisma()
);
