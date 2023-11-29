import { FileModel } from './../models/fileModels';

export class FilesRepo {
  async uploadFileWithMongo(body: any) {
    try {
      const task_exists = await FileModel.findOne({
        task_title: body.task_title,
      });
      if (!task_exists) {
        const task = await FileModel.create(body);
        return task;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error creating task: ", error);
      throw new Error("Could not create task");
    }
  }
}
