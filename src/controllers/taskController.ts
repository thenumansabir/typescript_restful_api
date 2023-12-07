import { Request, Response } from "express";
// import { TasksRepo } from "../repositories/taskRepositories";
import { TasksRepo } from "../repositories/taskRepoPG";
import { ValidationError, DatabaseError } from "../errorHandlers";

class TaskController {
  private myTask: TasksRepo;
  constructor(taskRepo: TasksRepo) {
    this.myTask = taskRepo;
  }
  // ************** Create Task *************
  createTask = async (req: Request, res: Response) => {
    try {
      const user_id =
        (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      const body = {
        task_title: req.body.task_title,
        task_description: req.body.task_description,
        is_completed: false,
        user_id: user_id,
        files_url: [],
      };
      if (role === "user") {
        if (!req.body.task_description) {
          res.status(400).json({ error: "Title and description are required" });
          return;
        } else {
          const task = await this.myTask.createTaskInDB(body);
          if (task) {
            return res.status(409).json({ error: "Task already exists" });
          } else {
            res.status(201).json({ message: "Task created successfully" });
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
      const user_id =
        (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      // Pagination
      const page = parseInt(req.query.page as string) || 1;
      const page_size = parseInt(req.query.page_size as string) || 10;

      if (role === "user") {
        const tasks = await this.myTask.getAllTasksFromDB(
          user_id,
          page,
          page_size
        );
        if (tasks === null || tasks.length === 0) {
          res.status(404).json({ error: "No tasks found" });
        } else {
          res.status(200).json({
            items: tasks,
            currentPage: page,
            pageSize: page_size,
            totalPages: Math.ceil(tasks.length / page_size),
          });
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
      const user_id =
        (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      if (role === "user") {
        const task = await this.myTask.getTaskFromDB(req.params.id, user_id);
        if (!task) {
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
      const user_id =
        (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      if (role === "user") {
        const task = await this.myTask.updateTaskInDB(
          req.params.id,
          user_id,
          req.body
        );
        if (!task) {
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
      const user_id =
        (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      if (role === "user") {
        const task = await this.myTask.deleteTaskFromDB(req.params.id, user_id);
        if (!task) {
          res.status(404).json({ error: "No task found" });
        } else {
          res.status(200).json({ message: "Task deleted successfully" });
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not delete task." });
      }
    } catch (error) {
      console.log(error);
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
//  data:image/png;base64,{ENCODED_STRING}
export default new TaskController(new TasksRepo());
