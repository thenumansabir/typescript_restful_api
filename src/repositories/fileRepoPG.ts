import { FileModel } from "./../models/fileModels";
import { TaskModel } from "../models/taskModels";
import pool from "../db";
import { Queries } from "../queries/queries";
import { ObjectId } from "mongodb";

const yourObjectId = new ObjectId();

export class FilesRepo {
  queries = new Queries();

  uploadFilesInDB(files: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        for (const file of files) {
          pool.query(
            this.queries.checkTaskExistsById,
            [file.task_id],
            (error, results) => {
              if (results.rows.length === 0) {
                resolve(false);
              } else {
                pool.query(
                  this.queries.uploadFile,
                  [
                    file.task_id,
                    file.file_name,
                    file.file_type,
                    file.file_ext,
                    file.file_base64,
                  ],
                  (error, results) => {
                    if (error) reject(error);
                    pool.query(
                      this.queries.pushFileIdInTask,
                      [results.rows[0].id, file.task_id],
                      (error, results) => {
                        console.log("===> results", results)
                        console.log("===> error", results)
                        if (error) reject(error);
                        resolve(results);
                      }
                    );
                  }
                );
              }
            }
          );
          //   const file_type = file.file_type;

          //   TaskModel.findByIdAndUpdate(file.task_id, {
          //     $push: {
          //       files_url: `${file_type}/${file_id}`,
          //     },
          //   });
        }
      } catch (error) {
        console.log("Error uploading file: ", error);
        throw new Error("Could not upload file");
      }
    });
  }

  async getFileFromDB(id: any) {
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

  async deleteFileFromDB(id: string) {
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
