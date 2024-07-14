import mongoose, { mongo } from "mongoose";
import { Location } from "../models/location.model.js";
import { location } from "../utils/validation.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uhidGen } from "../utils/location.util.js";
export const fetchAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res
      .status(200)
      .json(new ApiResponse(200, locations, "Locations Fetched Successfull"));
  } catch (err) {
    throw new ApiError(404, "No Location Found");
  }
};
export const createLocation = async (req, res, next) => {
  const { body } = req;
  const { error } = location.validate(body);
  if (error) {
    return next(new ApiError(400, "Bad request", error));
  }
  try {
    const loc = new Location(body);
    const existingLocation = await Location.findOne({
      $or: [{ name: body.name }, { prefix: body.prefix }],
    }).exec();
    if (existingLocation) {
      if (existingLocation.name === body.name) {
        return next(
          new ApiError(409, "Location Already Exists with given name")
        );
      }
      if (existingLocation.prefix === body.prefix) {
        return next(
          new ApiError(409, "Location with the given prefix exists.")
        );
      }
    }
    await loc.save();
    res.status(201).json(201, loc, "Location Created successfully");
  } catch (err) {
    next(new ApiError(500, err.errors, "Error While creating new location"));
  }
};

export const generateUHID = async (req, res, next) => {
  const { params } = req;
  console.log(req.params, "params");
  if (!params.prefix) {
    return next(
      new ApiError(400, "Prefix must be provided to generate new Id")
    );
  }
  try {
    const updated = await Location.findOneAndUpdate(
      { prefix: params.prefix },
      { $inc: { sequence: 1 } },
      { new: true }
    );
    if (updated) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `${params.prefix}${uhidGen(updated.sequence)}`,
            "fetched Id successfully"
          )
        );
    } else {
      return res.status(404).json(new ApiResponse(404, null, "Id not found"));
    }
  } catch (err) {
    throw new ApiError(500, "error fetching id");
  }
};
