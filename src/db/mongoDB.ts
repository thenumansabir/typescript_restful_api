import mongoose from "mongoose";

const base_url = "mongodb://localhost:27017/tasks";

if (process.env.DATABASE_TYPE == "mongoDB") {
  mongoose.connect(base_url);

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MonogDB connection error"));
  db.once("open", () => {
    console.log("===> Connected to database");
  });
}
