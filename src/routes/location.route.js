import { Router } from "express";
import {
  fetchAllLocations,
  createLocation,
  generateUHID
} from "../controllers/location.controller.js";
export const locationRouter = Router();
locationRouter.get("/", fetchAllLocations);
locationRouter.post("/create", createLocation);
locationRouter.get("/:prefix/getAndUpdate",generateUHID);