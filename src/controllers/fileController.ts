import { Request, Response } from "express";
import { FilesRepo } from "../repositories/fileRepositories";
import { ValidationError, DatabaseError } from "../errorHandlers";

class FileController {
  private myFile: FilesRepo;
  constructor(fileRepo: FilesRepo) {
    this.myFile = fileRepo;
  }
  // ************** Upload Files *************
  uploadFiles = async (req: Request, res: Response) => {
    try {
      const a:any = req.files
      console.log("===> ", a[0]);
      const user_id =
        (req.headers.decoded_token as { user_id?: string })?.user_id ?? null;
      const buffer: any = (req.files as { buffer?: string })?.buffer ?? null;
      const file_name: any =
        (req.files as { originalname?: string })?.originalname ?? null;
      const mimetype: any =
        (req.files as { mimetype?: string })?.mimetype ?? null;
      const extension: string = mimetype.split("/")[1];
      // console.log("===> ", user_id, buffer, file_name, extension);


      // const role =
      //   (req.headers.decoded_token as { role?: string })?.role ?? null;
      // const body = {
      //   task_title: req.body.task_title,
      //   task_description: req.body.task_description,
      //   is_completed: false,
      //   user_id: user_id,
      //   // files: req.file ? buffer.toString("base64") : undefined
      // };
      // if (role === "user") {
      //   if (!req.body.task_description) {
      //     res.status(400).json({ error: "Title and description are required" });
      //     return;
      //   } else {
      //     const task = await this.myFile.uploadFileWithMongo(body);
      //     if (task === null) {
      //       return res.status(409).json({ error: "Task already exists" });
      //     } else {
      //       res.status(201).json({ message: "Task created successfully" });
      //     }
      //   }
      // } else if (role === "admin") {
      //   res.status(400).json({ error: "Admin can not create task." });
      // }
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
