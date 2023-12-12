import { Request, Response } from "express";
// import { FilesRepo } from "../repositories/fileRepositories";
import { FilesRepo } from "../repositories/fileRepoPG";
import { ValidationError, DatabaseError } from "../errorHandlers";

class FileController {
  private myFile: FilesRepo;
  constructor(fileRepo: FilesRepo) {
    this.myFile = fileRepo;
  }
  // ************** Upload Files *************
  uploadFiles = async (req: Request, res: Response) => {
    try {
      const user_id =
        (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      const files: any = req.files;
      const files_body: any = [];
      files.forEach((file: any) => {
        const file_name = file.originalname;
        const file_type = file.mimetype.split("/")[0];
        const file_ext = file.mimetype.split("/")[1];
        const buffer = file.buffer;
        const body = {
          task_id: req.body.task_id,
          file_name: file_name,
          file_type: file_type,
          file_ext: file_ext,
          file_base64: buffer.toString("base64"),
        };
        files_body.push(body);
      });
      if (role === "user") {
        if (
          req.body.task_id === undefined ||
          !req.files ||
          req.files.length === 0
        ) {
          res.status(400).json({ error: "file and task_id are required" });
          return;
        } else {
          const response: any = await this.myFile.uploadFilesInDB(
            files_body
          );
          if (!response) {
            return res.status(409).json({ error: "Task not found" });
          } else {
            res.status(201).json({ message: "File uploaded successfully" });
          }
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not upload files." });
      }
    } catch (error) {
      console.log("===> error", error)

      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  // ************** get File *************
  getFile = async (req: Request, res: Response) => {
    try {
      const user_id = "65604c8d3e58477395d6a17c";
      // const user_id = (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const role = "user";
      // const role = "user" (req.headers.decoded_token as { role?: string })?.role ?? null;
      if (role === "user") {
        const response = await this.myFile.getFileFromDB(req.params.id);
        if (!response) {
          res.status(404).json({ error: "No file found" });
        } else {
          const base64String = response.file_base64;
          const mimetype = `${response.file_type}/${response.file_ext}`;
          const filename = "download";

          res.setHeader("Content-Type", mimetype);
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=${filename}.${response.file_ext}`
          );
          res.send(Buffer.from(base64String, "base64"));
          // res.status(200).json(response);
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not get file." });
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

  // ************** Delete File *************
  deleteFile = async (req: Request, res: Response) => {
    try {
      const user_id =
        (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const role =
        (req.headers.decoded_token as { role?: string })?.role ?? null;
      if (role === "user") {
        const response = await this.myFile.deleteFileFromDB(req.params.id);
        if (!response) {
          res.status(404).json({ error: "No file found" });
        } else {
          res.status(200).json({ message: "File deleted successfully" });
        }
      } else if (role === "admin") {
        res.status(400).json({ error: "Admin can not delete file." });
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
}
//  data:image/png;base64,{ENCODED_STRING}
export default new FileController(new FilesRepo());
