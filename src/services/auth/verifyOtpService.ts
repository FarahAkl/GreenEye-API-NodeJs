import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appError.js";
import { passwordReset } from "../../models/passwordReset.model.js";
import { pendingRegistration } from "../../models/pendingRegistration.model.js";
import { userModel as User } from "../../models/user.model.js";
import type { verifyOtpT } from "../../schemas/auth.schema.js";

export const verifyOtpService = async (data: verifyOtpT) => {
  const { email, type, otp } = data;

  if (type === "registration") {
    const pendingUser = await pendingRegistration.findOne({ email });

    if (!pendingUser) throw new AppError("User not found", 404);

    if (pendingUser.otpAttempts >= 10) {
      throw new AppError("Too many OTP attempts", 429);
    }

    if (new Date() > pendingUser.otpExpiresAt) {
      throw new AppError("OTP expired", 400);
    }

    await pendingRegistration.findOneAndUpdate(
      { email: pendingUser.email },
      { otpAttempts: pendingUser.otpAttempts + 1 },
    );

    const validOTP = await bcrypt.compare(otp, pendingUser.otpHash);
    if (!validOTP) throw new AppError("Not valid OTP", 400);

    await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      address: pendingUser.address,
      phoneNumber: pendingUser.phoneNumber,
      role: pendingUser.role,
      ...(pendingUser.avatar && { avatar: pendingUser.avatar }),
      status: pendingUser.role === "user" ? "approved" : "pending",
    });

    await pendingRegistration.deleteOne({ _id: pendingUser._id });

    return { message: "Email is successfully verified" };
  }

  if (type === "forget_password") {
    const resetRequest = await passwordReset.findOne({ email });

    if (!resetRequest) throw new AppError("User not found", 404);

    if (resetRequest.otpAttempts >= 10) {
      throw new AppError("Too many OTP attempts", 429);
    }

    if (new Date() > resetRequest.otpExpiresAt) {
      throw new AppError("OTP expired", 400);
    }

    await passwordReset.findOneAndUpdate(
      { email: resetRequest.email },
      { otpAttempts: resetRequest.otpAttempts + 1 },
    );

    const validOTP = await bcrypt.compare(otp, resetRequest.otpHash);
    if (!validOTP) throw new AppError("Not valid OTP", 400);

    const jwtResetSecret = process.env.JWT_RESET_SECRET_KEY;
    if (!jwtResetSecret) {
      throw new AppError("JWT secret is not configured", 500);
    }

    const resetToken = jwt.sign({ email: resetRequest.email }, jwtResetSecret, {
      expiresIn: "15m",
    });

    return { message: "Email is successfully verified", resetToken };
  }

  throw new AppError("Type not valid", 400);
};
