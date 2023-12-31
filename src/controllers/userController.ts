import { Request, Response } from "express";
import { UsersRepo } from "../repositories/userRepositories";
import { ValidationError, DatabaseError } from "../errorHandlers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config/config.services";

class UserController {
  private myUser: UsersRepo;
  constructor(userRepo: UsersRepo) {
    this.myUser = userRepo;
  }

  // ************** Register User **************
  registerUser = async (req: Request, res: Response) => {
    try {
      if (!req.body.email && !req.body.password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      } else {
        const user = await this.myUser.userRegistration(req.body);
        if (user === null) {
          return res.status(409).json({ error: "User already exists" });
        } else {
          res.status(201).json({
            message: `${user.email} registered successfully.`,
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
      }

      const user = await this.myUser.userLogin(req.body);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "An unexpected error occurred" });
        }

        if (result) {
          const token = jwt.sign(
            { email: user.email, user_id: user._id, role: user.role },
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
      const role = req.body.decoded_token.role;
      if (role === "admin") {
        const users = await this.myUser.getAllUsersFromDB();
        if (users === null || users.length === 0) {
          res.status(404).json({ error: "No user found" });
        } else {
          res.status(200).json(users);
        }
      } else if (role === "user") {
        res.status(400).json({ error: "user can not get users." });
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

  // ************** Get Single User (Only Admin can) **************
  getUser = async (req: Request, res: Response) => {
    try {
      const role = req.body.decoded_token.role;
      if (role === "admin") {
        const user = await this.myUser.getUserFromDB(req.params.id);
        if (user === null || user.length === 0) {
          res.status(404).json({ error: "No user found" });
        } else {
          res.status(200).json(user);
        }
      } else if (role === "user") {
        res.status(400).json({ error: "user can not get user." });
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
      const role = req.body.decoded_token.role;
      if (role === "admin") {
        const user = await this.myUser.updateUserInDB(
          req.params.id,
          req.body
        );
        if (user === null) {
          res.status(404).json({ error: "No user found" });
        } else {
          res.status(200).json({ message: "User successfully updated." });
        }
      } else if (role === "user") {
        res.status(400).json({ error: "user can not update user." });
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
      const role = req.body.decoded_token.role;
      if (role === "admin") {
        const user = await this.myUser.deleteUserFromDB(req.params.id);
        if (user === null) {
          res.status(404).json({ error: "No user found" });
        } else {
          res.status(200).json({ message: "User deleted successfully" });
        }
      } else if (role === "user") {
        res.status(400).json({ error: "user can not delete user." });
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
}

export default new UserController(new UsersRepo());
