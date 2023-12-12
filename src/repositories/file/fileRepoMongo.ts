import { FileModel } from "../../models/fileModels";
import { TaskModel } from "../../models/taskModels";
import { ObjectId } from "mongodb";
import { IFilesRepo } from "./IFileRepo";

const yourObjectId = new ObjectId();

export class FilesRepoMongo implements IFilesRepo {
  async uploadFilesInDB(files: any[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        for (const file of files) {
          const task_exist = await TaskModel.findOne({ _id: file.task_id });
          if (!task_exist) {
            resolve(false);
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
        resolve(true);
      } catch (error) {
        reject(error);
        console.log("Error uploading file: ", error);
        throw new Error("Could not upload file");
      }
    });
  }

  async getFileFromDB(id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const file = await FileModel.findById({
          _id: id,
        });
        // const base64_string = file?.file_base64;
        resolve(file);
      } catch (error) {
        reject(error);
        console.log("Error fetching task: ", error);
        throw new Error("Could not fetch task");
      }
    });
  }

  async deleteFileFromDB(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const file_exist:any = await FileModel.findById({
          _id: id,
        });
        console.log(file_exist)
        if (file_exist && file_exist.length !== 0) {
          const file = await FileModel.findByIdAndDelete(id);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
        console.log("Error deleting file: ", error);
        throw new Error("Could not delete file");
      }
    });
  }
}
