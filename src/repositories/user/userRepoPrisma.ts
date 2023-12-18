import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UsersRepoPrisma {
  userRegistration(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user_exists = await prisma.user.findUnique({
          where: { email: body.email },
        });
        if (user_exists) {
          console.log(user_exists)
          resolve(false);
        } else {
          const user = await prisma.user.create({
            data: {
              email: body.email,
              password: body.password,
              role: body.role,
              status: "active",
            },
          });
          console.log(user)
          if (user) resolve(true);
          else resolve(false);
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
      } catch (error) {
        reject(error);
        console.log("Error deleting users: ", error);
        throw new Error("Could not delete users");
      }
    });
  }
}
