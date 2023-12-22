import "./config/dotenv.config";
import express from "express";
import cors from "cors";
import bodyPaser from "body-parser";
import router from "./routes/routes";
import "./db/mongoDB";

const app = express();

app.use(cors());
app.use(bodyPaser.json());

app.use("/api", router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
