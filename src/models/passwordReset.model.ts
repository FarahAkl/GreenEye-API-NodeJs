import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    otpHash: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
    forgetPasswordExpiresAt: {
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
    resetTokenUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

passwordResetSchema.index(
  { forgetPasswordExpiresAt: 1 },
  { expireAfterSeconds: 0 },
);

export const passwordReset = mongoose.model(
  "passwordReset",
  passwordResetSchema,
);
