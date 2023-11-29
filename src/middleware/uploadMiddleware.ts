import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
}).array('files')



// import path from "path";
// import multer, { StorageEngine } from "multer";
// import { Request } from "express";

// const storage: StorageEngine = multer.diskStorage({
//   destination: (req: Request, file: any, cb: any) => {
//     cb(null, "uploads/");
//   },
//   filename: (req: Request, file: any, cb: any) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

// export const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, callback) {
//     if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
//       callback(null, true);
//     } else {
//       console.log("only png & jpg file supported!");
//       callback(null, false);
//     }
//   },
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
// });
