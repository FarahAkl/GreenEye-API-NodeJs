import mongoose from "mongoose";
import { registerRoles } from "../utils/constants.js";

const pendingRegistrationSchema = new mongoose.Schema(
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
      enum: registerRoles,
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
    registerExpiresAt: {
      type: Date,
      required: true,
    },
    lastOtpSentAt: {
      type: Date,
      required: true,
    },
    otpAttempts: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

pendingRegistrationSchema.index({ registerExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const pendingRegistration = mongoose.model(
  "pendingRegistration",
  pendingRegistrationSchema,
);
