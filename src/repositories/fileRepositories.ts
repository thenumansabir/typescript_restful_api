import { Task } from "./../models/taskModels";
import { FileModel } from "./../models/fileModels";
import { TaskModel } from "../models/taskModels";
import { ObjectId } from "mongodb";

const yourObjectId = new ObjectId();

export class FilesRepo {
  async uploadFileWithMongo(files: any[]) {
    try {
      for (const file of files) {
        const task_exist = await TaskModel.findOne({ _id: file.task_id });
        if (!task_exist) {
          return false;
        } else {
          const response = await FileModel.create(file);
          const file_id: string = response._id.toString();
          const file_type = file.file_type;

         await TaskModel.findByIdAndUpdate(file.task_id, {
            $push: {
              files_url: `${file_type}/${file_id}`,
            },
          });
        }
      }
      return true;
    } catch (error) {
      console.log("Error uploading file: ", error);
      throw new Error("Could not upload file");
    }
  }

  async getFileWithMongo(id: any) {
    try {
      const file = await FileModel.findById({
        _id: id,
      });
      // const base64_string = file?.file_base64;
      return file;
    } catch (error) {
      console.log("Error fetching task: ", error);
      throw new Error("Could not fetch task");
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
