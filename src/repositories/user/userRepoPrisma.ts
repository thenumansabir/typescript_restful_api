import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UsersRepoPrisma {
  userRegistration(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user_exists: any = await prisma.user.findUnique({
          where: { email: body.email },
        });
        if (user_exists) {
          resolve(user_exists);
        } else {
          const user = await prisma.user.create({
            data: {
              email: body.email,
              password: await bcrypt.hash(body.password, 10),
              role: body.role,
              status: "active",
            },
          });
          if (user) resolve(false);
          else resolve(true);
        }
      } catch (error) {
        reject(error);
        console.log("Error regitering user: ", error);
        throw new Error("Could not register user");
      }
    });
  }

  userLogin(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: body.email, status: "active" },
        });
        if (user) resolve(user);
        resolve(false);
      } catch (error) {
        reject(error);
        console.log("Error logging user: ", error);
        throw new Error("Could not Login user");
      }
    });
  }

  getAllUsersFromDB(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.user.findMany({
          include: {
            tasks: true,
          },
        });
        if (user) resolve(user);
        resolve(false);
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
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id) },
          include: {
            tasks: true,
          },
        });
        if (user) resolve(user);
        resolve(false);
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
        const user = await prisma.user.update({
          where: { id: parseInt(id) },
          data: {
            status: body.status,
          },
        });
        if (user) resolve(user);
        resolve(false);
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
        const user_exists: any = await prisma.user.findUnique({
          where: { id: parseInt(id) },
        });
        if (user_exists) {
          const user = await prisma.user.delete({
            where: { id: parseInt(id) },
          });
          resolve(user);
        }
        resolve(false);
      } catch (error) {
        reject(error);
        console.log("Error deleting users: ", error);
        throw new Error("Could not delete users");
      }
    });
  }
}
