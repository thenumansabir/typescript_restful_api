import { Response } from "express";
import { TaskModel } from "./models";

export class TasksRepo {
  async createTaskWithMongo(body: any) {
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

  async getAllTasksWithMongo() {
    try {
      const tasks = await TaskModel.find();
      return tasks;
    } catch (error) {
      console.log("Error fetching task: ", error);
      throw new Error("Could not fetch task");
    }
  }

  async getTaskWithMongo(id: any) {
    try {
      const task = await TaskModel.findById(id);
      return task;
    } catch (error) {
      console.log("Error fetching task: ", error);
      throw new Error("Could not fetch task");
    }
  }

  async updateTaskWithMongo(id: any, body: Object) {
    try {
      const task_exists = await TaskModel.findById(id);
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

  async deleteTaskWithMongo(id: any) {
    try {
      const task_exists = await TaskModel.findById(id);
      if (task_exists) {
        const task = await TaskModel.findByIdAndDelete(id);
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
