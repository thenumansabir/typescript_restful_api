import { Request, Response } from "express";
import { TasksRepo } from "../repositories/taskRepositories";
import { ValidationError, DatabaseError } from "../errorHandlers";
import { UserModel } from "../models/userModels";

class TaskController {
  private myTask: TasksRepo;
  constructor(taskRepo: TasksRepo) {
    this.myTask = taskRepo;
  }
  // ************** Create Task *************
  createTask = async (req: Request, res: Response) => {
    try {
      const user_id = req.body.decoded_token.user_id;
      const role = req.body.decoded_token.role;

      const body = {
        task_title: req.body.task_title,
        task_description: req.body.task_description,
        is_complete: false,
        user_id: user_id,
      };
      if (role === "user") {
        if (!req.body.task_description) {
          res.status(400).json({ error: "Title and description are required" });
          return;
        } else {
          const task = await this.myTask.createTaskWithMongo(body);
          if (task === null) {
            return res.status(409).json({ error: "Task already exists" });
          } else {
            res
              .status(201)
              .json({ message: "Task created successfully", task });
          }
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not create task." });
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

  // ************** Get All Tasks **************
  getAllTasks = async (req: Request, res: Response) => {
    try {
      const user_id = req.body.decoded_token.user_id;
      const role = req.body.decoded_token.role;
      if (role === "user") {
        const tasks = await this.myTask.getAllTasksWithMongo(user_id);
        if (tasks === null || tasks.length === 0) {
          res.status(404).json({ error: "No tasks found" });
        } else {
          res.status(200).json(tasks);
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not get tasks." });
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

  // ************** Get Single Task **************
  getTask = async (req: Request, res: Response) => {
    try {
      const user_id = req.body.decoded_token.user_id;
      const role = req.body.decoded_token.role;
      if (role === "user") {
        const task = await this.myTask.getTaskWithMongo(req.params.id, user_id);
        if (task === null) {
          res.status(404).json({ error: "No task found" });
        } else {
          res.status(200).json(task);
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not get task." });
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

  // ************** Update Task **************
  updateTask = async (req: Request, res: Response) => {
    try {
      const user_id = req.body.decoded_token.user_id;
      const role = req.body.decoded_token.role;
      if (role === "user") {
        const task = await this.myTask.updateTaskWithMongo(
          req.params.id,
          req.body,
          user_id
        );
        if (task === null) {
          res.status(404).json({ error: "No task found" });
        } else {
          res.status(200).json({ message: "Task updated successfully." });
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not get task." });
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

  // ************** Delete Task **************
  deleteTask = async (req: Request, res: Response) => {
    try {
      const user_id = req.body.decoded_token.user_id;
      const role = req.body.decoded_token.role;
      if (role === "user") {
        const task = await this.myTask.deleteTaskWithMongo(
          req.params.id,
          user_id
        );
        if (task === null) {
          res.status(404).json({ error: "No task found" });
        } else {
          res.status(200).json({ message: "Task deleted successfully" });
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not get task." });
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

export default new TaskController(new TasksRepo());
