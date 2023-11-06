import { Request, Response } from "express";
import { TasksRepo } from "./repositories";
import { ValidationError, DatabaseError } from "./errorHandlers"

class TaskController {
  private myTask: TasksRepo;
  constructor(taskRepo: TasksRepo) {
    this.myTask = taskRepo;
  }
  createTask = async (req: Request, res: Response) => {
    try {
      if (!req.body.task_title || !req.body.task_description) {
        res.status(400).json({ error: "Title and description are required" });
        return;
      } else {
        const task = await this.myTask.createTaskWithMongo(req.body);
        if (task === null) {
          return res.status(409).json({ error: "Task already exists" });
        } else {
          res.status(201).json({ message: "Task created successfully", task });
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

  getAllTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await this.myTask.getAllTasksWithMongo();

      if (tasks === null || tasks.length === 0) {
        res.status(404).json({ error: "No tasks found" });
      } else {
        res.status(200).json(tasks);
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

  getTask = async (req: Request, res: Response) => {
    try {
      const task = await this.myTask.getTaskWithMongo(req.params.id);
      if (task === null) {
        res.status(404).json({ error: "No task found" });
      } else {
        res.status(200).json(task);
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

  updateTask = async (req: Request, res: Response) => {
    try {
      const task = await this.myTask.updateTaskWithMongo(
        req.params.id,
        req.body
      );
      if (task === null) {
        res.status(404).json({ error: "No task found" });
      } else {
        res.status(200).json(task);
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

  deleteTask = async (req: Request, res: Response) => {
    try {
      const task = await this.myTask.deleteTaskWithMongo(req.params.id);
      if (task === null) {
        res.status(404).json({ error: "No task found" });
      } else {
        res.status(200).json({ message: "Task deleted successfully", task });
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
