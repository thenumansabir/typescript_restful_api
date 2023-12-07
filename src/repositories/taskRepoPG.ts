import pool from "../db";
import { Queries } from "../queries/queries";


export class TasksRepo {
  queries = new Queries();

  createTaskInDB(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const task_exists = await pool.query(this.queries.checkTaskExists, [
          body.task_title,
        ]);
        if (task_exists.rows && task_exists.rows.length > 0) {
          resolve(task_exists.rows);
        } else {
          const new_task = await pool.query(this.queries.createTask, [
            body.task_title,
            body.task_description,
            body.is_completed,
            body.user_id,
            body.files_url,
          ]);
          resolve(new_task.rows[0]);
        }
      } catch (error) {
        reject(error);
        console.log("Error creating task: ", error);
        throw new Error("Could not create task");
      }
    });
  }

  getAllTasksFromDB(id: any, page: number, page_size: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const start_index = (page - 1) * page_size;
        const end_index = page * page_size;
        pool.query(
          this.queries.getAllTasks,
          [id, start_index, end_index],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results.rows);
            }
          }
        );
      } catch (error) {
        console.log("Error fetching task: ", error);
        throw new Error("Could not fetch task");
      }
    });
  }

  getTaskFromDB(id: string, user_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        pool.query(
          this.queries.getTaskById,
          [id, user_id],
          (error, results) => {
            if (!results.rows[0]) reject;
            resolve(results.rows[0]);
          }
        );
      } catch (error) {
        console.log("Error fetching task: ", error);
        throw new Error("Could not fetch task");
      }
    });
  }

  //   async updateTaskInDB(id: any, body: Object, user_id: any) {
  //     try {
  //       const task_exists = await TaskModel.findById({
  //         _id: id,
  //         user_id: user_id,
  //       });
  //       if (task_exists) {
  //         const task = await TaskModel.findByIdAndUpdate(id, body, { new: true });
  //         return task;
  //       } else {
  //         return null;
  //       }
  //     } catch (error) {
  //       console.log("Error updating task: ", error);
  //       throw new Error("Could not update task");
  //     }
  //   }

  deleteTaskFromDB(id: any, user_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        pool.query(
          this.queries.getTaskById,
          [id, user_id],
          (error, results) => {
            const no_task_found = !results.rows.length;
            if (no_task_found) {
              resolve(false);
            } else {
              pool.query(
                this.queries.deleteTask,
                [id, user_id],
                (error, results) => {
                  if (error) reject();
                  resolve(results);
                }
              );
            }
          }
        );
      } catch (error) {
        reject(error);
        console.log("Error deleting task: ", error);
        throw new Error("Could not delete task");
      }
    });
  }
}
