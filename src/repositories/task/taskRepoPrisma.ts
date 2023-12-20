import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TasksRepoPrisma {
  createTaskInDB(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task_exists = await prisma.task.findUnique({
          where: { task_title: body.task_title },
        });
        if (task_exists) resolve(task_exists);
        else {
          await prisma.task.create({
            data: {
              task_title: body.task_title,
              task_description: body.task_description,
              is_completed: body.is_completed,
              user: { connect: { id: body.user_id } },
            },
          });
          resolve(false);
        }
      } catch (error) {
        reject(error);
        console.log("Error creating task: ", error);
        throw new Error("Could not create task");
      }
    });
  }

  getAllTasksFromDB(id: any, page: number, page_size: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const tasks = await prisma.task.findMany({
          where: { user_id: parseInt(id) },
        });
        resolve(tasks);
      } catch (error) {
        console.log("Error fetching task: ", error);
        throw new Error("Could not fetch task");
      }
    });
  }

  getTaskFromDB(id: string, user_id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task = await prisma.task.findUnique({
          where: { id: parseInt(id), user_id: user_id },
        });
        if (task) resolve(task);
        resolve(false);
      } catch (error) {
        console.log("Error fetching task: ", error);
        throw new Error("Could not fetch task");
      }
    });
  }

  updateTaskInDB(id: any, user_id: any, body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task_exists = await prisma.task.findUnique({
          where: { id: parseInt(id), user_id: user_id },
        });
        if (task_exists) {
          const task = await prisma.task.update({
            where: { id: parseInt(id), user_id: user_id },
            data: {
              task_title: body.task_title,
              task_description: body.task_description,
            },
          });
          resolve(task);
        }
        resolve(false);
      } catch (error) {
        reject(error);
        console.log("Error updating user: ", error);
        throw new Error("Could not update user");
      }
    });
  }
  deleteTaskFromDB(id: any, user_id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task_exists = await prisma.task.findUnique({
          where: { id: parseInt(id), user_id: user_id },
        });
        if (task_exists) {
          const task = await prisma.task.delete({
            where: { id: parseInt(id), user_id: user_id },
          });
          resolve(task);
        }
        resolve(false);
      } catch (error) {
        reject(error);
        console.log("Error deleting task: ", error);
        throw new Error("Could not delete task");
      }
    });
  }
}
