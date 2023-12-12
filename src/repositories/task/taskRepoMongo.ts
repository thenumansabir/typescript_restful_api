import { TaskModel } from "../../models/taskModels";

export class TasksRepoMongo {
  async createTaskInDB(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task_exists = await TaskModel.findOne({
          task_title: body.task_title,
        });
        if (!task_exists) {
          const task = await TaskModel.create(body);
          resolve(false);
        } else {
          resolve(task_exists);
        }
      } catch (error) {
        reject(error);
        console.log("Error creating task: ", error);
        throw new Error("Could not create task");
      }
    });
  }

  async getAllTasksFromDB(
    id: any,
    page: number,
    page_size: number
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const start_index = (page - 1) * page_size;
        const end_index = page * page_size;
        const tasks = await TaskModel.find({ user_id: id })
          .skip(start_index)
          .limit(page_size)
          .exec();
        resolve(tasks);
      } catch (error) {
        reject(error);
        console.log("Error fetching task: ", error);
        throw new Error("Could not fetch task");
      }
    });
  }

  async getTaskFromDB(id: string, user_id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task = await TaskModel.findOne({ _id: id, user_id: user_id });
        resolve(task);
      } catch (error) {
        reject(error);
        console.log("Error fetching task: ", error);
        throw new Error("Could not fetch task");
      }
    });
  }

  async updateTaskInDB(id: any, user_id: any, body: Object): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task_exists = await TaskModel.find().and([
          { _id: id },
          { user_id: user_id },
        ]);
        if (task_exists.length !== 0) {
          const task = await TaskModel.findByIdAndUpdate(id, body, {
            new: true,
          });
          resolve(task);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
        console.log("Error updating task: ", error);
        throw new Error("Could not update task");
      }
    });
  }

  async deleteTaskFromDB(id: string, user_id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task_exists = await TaskModel.find().and([
          { _id: id },
          { user_id: user_id },
        ]);
        if (task_exists && task_exists.length !== 0) {
          const task = await TaskModel.findByIdAndDelete(id);
          resolve(task);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
        console.log("Error deleting task: ", error);
        throw new Error("Could not delete task");
      }
    });
  }
}
