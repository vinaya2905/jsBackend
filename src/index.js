import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { locationBaseUrl } from "./constants/constants.js";
import { locationRouter } from "./routes/location.route.js";
import { ApiError } from "./utils/ApiError.js";
const app = express();
dotenv.config({
  path: "/home/vinayasree/Desktop/js-be/.env",
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); //to handle cross origin websites
app.use(express.json({ limit: "16kb" })); //indicates json limit data photo that need to be accepted
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // if any assets required that need to be stored in public folder
app.use(cookieParser());
app.use(locationBaseUrl, locationRouter);
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
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
