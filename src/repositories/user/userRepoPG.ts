import bcrypt from "bcrypt";
import pool from "../../postgreSQL";
import { Queries } from "../../queries/queries";
import { IUsersRepo } from "./IUserRepo";

export class UsersRepoPG implements IUsersRepo {
  queries = new Queries();

  userRegistration(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const password: string = body.password;
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const user_exists = await pool.query(this.queries.checkUserExists, [
          body.email,
        ]);
        if (user_exists.rows && user_exists.rows.length > 0) {
          resolve(user_exists.rows);
        } else {
          const new_user = await pool.query(this.queries.addUser, [
            body.email,
            hashedPassword,
            "active",
            body.role,
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

  getAllUsersFromDB(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        pool.query(this.queries.getAllUsers, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.rows);
          }
        });
      } catch (error) {
        reject(error);
        console.log("Error fetching users: ", error);
        throw new Error("Could not fetch users");
      }
    });
  }

  getUserFromDB(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        pool.query(this.queries.getUserById, [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.rows);
          }
        });
      } catch (error) {
        reject(error);
        console.log("Error fetching users: ", error);
        throw new Error("Could not fetch users");
      }
    });
  }

  updateUserInDB(id: any, body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        pool.query(this.queries.getUserById, [id], (error, results) => {
          const no_user_found = !results.rows.length;
          if (no_user_found) {
            reject();
          } else {
            pool.query(
              this.queries.updateUser,
              [body.status, id],
              (error, results) => {
                if (error) throw error;
                else {
                  resolve(results);
                }
              }
            );
          }
        });
      } catch (error) {
        reject(error);
        console.log("Error updating user: ", error);
        throw new Error("Could not update user");
      }
    });
  }

  deleteUserFromDB(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        pool.query(this.queries.getUserById, [id], (error, results) => {
          const no_user_found = !results.rows.length;
          if (no_user_found) {
            resolve(false);
          } else {
            pool.query(this.queries.deleteUser, [id], (error, results) => {
              if (error) reject();
              resolve(results);
            });
          }
        });
      } catch (error) {
        reject(error);
        console.log("Error deleting users: ", error);
        throw new Error("Could not delete users");
      }
    });
  }
}
