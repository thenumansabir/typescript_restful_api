export interface ITasksRepo {
  createTaskInDB(body: any): Promise<any>;
  getAllTasksFromDB(id: any, page: number, page_size: number): Promise<any>;
  getTaskFromDB(id: string, user_id: any): Promise<any>;
  updateTaskInDB(id: any, user_id: any, body: any): Promise<any>;
  deleteTaskFromDB(id: any, user_id: any): Promise<any>;
}
