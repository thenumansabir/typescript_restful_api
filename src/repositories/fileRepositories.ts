import { FileModel } from "./../models/fileModels";
import { TaskModel } from "../models/taskModels";

export class FilesRepo {
  async uploadFileWithMongo(files: any[]) {
    try {
      for (const file of files) {
        const task_exist = await TaskModel.findOne({ _id: file.task_id });
        if (!task_exist) {
          return false;
        } else {
          await FileModel.create(file);
        }
      }
      return true;
    } catch (error) {
      console.log("Error uploading file: ", error);
      throw new Error("Could not upload file");
    }
  }
  async deleteFileWithMongo(id: string) {
    try {
      const file_exist = await FileModel.findById({
        _id: id,
      });
      if (file_exist) {
        const file = await FileModel.findOneAndDelete();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error deleting file: ", error);
      throw new Error("Could not delete file");
    }
  }
}
