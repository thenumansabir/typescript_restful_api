import { PrismaClient } from "@prisma/client";
import { IFilesRepo } from "./IFileRepo";

const prisma = new PrismaClient();

export class FilesRepoPrisma implements IFilesRepo {
  uploadFilesInDB(files: any[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        for (const f of files) {
          const task_exists = await prisma.task.findUnique({
            where: { id: parseInt(f.task_id) },
          });
          if (task_exists){

            const file = await prisma.file.create({
              data: {
                task: { connect: { id: parseInt(f.task_id) } },
                file_name: f.file_name,
                file_type: f.file_type,
                file_ext: f.file_ext,
                file_base64: f.file_base64,
              },
            });
            resolve(file)
          }
          resolve(false);
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
      } catch (error) {
        console.log("Error fetching file: ", error);
        throw new Error("Could not fetch file");
      }
    });
  }
  deleteFileFromDB(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
      } catch (error) {
        reject(error);
        console.log("Error deleting file: ", error);
        throw new Error("Could not delete file");
      }
    });
  }
}
