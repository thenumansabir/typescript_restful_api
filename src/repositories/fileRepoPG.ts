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
                    if (error) {
                      reject(error);
                    } else {
                      const file_url = `${file.file_type}/${results.rows[0].id}`;
                      pool.query(
                        this.queries.pushFileIdInTask,
                        [[file_url], file.task_id],
                        (error, results) => {
                          if (error) {
                            reject(error);
                          } else {
                            resolve(results);
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      } catch (error) {
        console.log("Error uploading file: ", error);
        throw new Error("Could not upload file");
      }
    });
  }

  getFileFromDB(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        pool.query(
          this.queries.getFileById,
          [id],
          (error, results) => {
            if (!results.rows[0]) reject;
            resolve(results.rows[0]);
          }
        );
      } catch (error) {
        console.log("Error fetching file: ", error);
        throw new Error("Could not fetch file");
      }
    });
  }
  deleteFileFromDB(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        pool.query(
          this.queries.getFileById,
          [id],
          (error, results) => {
            const no_file_found = !results.rows.length;
            if (no_file_found) {
              resolve(false);
            } else {
              pool.query(
                this.queries.deleteFile,
                [id],
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
        console.log("Error deleting file: ", error);
        throw new Error("Could not delete file");
      }
    });
  }
}
