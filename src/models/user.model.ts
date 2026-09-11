import mongoose from "mongoose";
import { userRoles } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        userRoles.ADMIN,
        userRoles.USER,
        userRoles.EXPERT,
        userRoles.SUPPLIER,
      ],
      requied: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model("User", userSchema);
