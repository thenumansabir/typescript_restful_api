import { TaskModel } from "../models/taskModels";

export class TasksRepo {
  async createTaskInDB(body: any) {
    try {
      const task_exists = await TaskModel.findOne({
        task_title: body.task_title,
      });
      if (!task_exists) {
        const task = await TaskModel.create(body);
        return task;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error creating task: ", error);
      throw new Error("Could not create task");
    }
  }

  async getAllTasksFromDB(id: any, page: number, page_size: number) {
    try {
      const start_index = (page - 1) * page_size;
      const end_index = page * page_size;
      const tasks = await TaskModel.find({ user_id: id })
        .skip(start_index)
        .limit(page_size)
        .exec();
      return tasks;
    } catch (error) {
      console.log("Error fetching task: ", error);
      throw new Error("Could not fetch task");
    }
  }

  async getTaskFromDB(id: string, user_id: any) {
    try {
      const task = await TaskModel.findOne({ _id: id, user_id: user_id });
      return task;
    } catch (error) {
      console.log("Error fetching task: ", error);
      throw new Error("Could not fetch task");
    }
  }

  async updateTaskInDB(id: any, body: Object, user_id: any) {
    try {
      const task_exists = await TaskModel.findById({
        _id: id,
        user_id: user_id,
      });
      if (task_exists) {
        const task = await TaskModel.findByIdAndUpdate(id, body, { new: true });
        return task;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error updating task: ", error);
      throw new Error("Could not update task");
    }
  }

  async deleteTaskFromDB(id: string, user_id: any) {
    try {
      const task_exists = await TaskModel.findById({
        _id: id,
        user_id: user_id,
      });
      if (task_exists) {
        const task = await TaskModel.findOneAndDelete();
        return task;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error deleting task: ", error);
      throw new Error("Could not delete task");
    }
  }
}
