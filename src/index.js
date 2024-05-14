import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

const app = express();
dotenv.config({
  path: "/home/vinayasree/Desktop/js-be/.env",
});
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO connection failed !!", error);
  });
