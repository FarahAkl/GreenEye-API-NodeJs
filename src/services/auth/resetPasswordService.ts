import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appError.js";
import { userModel as User } from "../../models/user.model.js";
import { passwordReset } from "../../models/passwordReset.model.js";
import type { resetPasswordT } from "../../schemas/auth.schema.js";

export const resetPasswordService = async ({
  data,
  resetToken,
}: {
  data: resetPasswordT;
  resetToken: string;
}) => {
  const jwtResetSecret = process.env.JWT_RESET_SECRET_KEY;
  if (!jwtResetSecret) {
    throw new AppError("JWT secret is not configured", 500);
  }
  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(resetToken, jwtResetSecret);
  } catch (error) {
    throw new AppError("Invalid or expired reset token", 401);
  }

  if (typeof payload === "string" || typeof payload.email !== "string") {
    throw new AppError("Invalid reset token", 401);
  }
  const resetRequest = await passwordReset.findOne({ email: payload.email });

  if (!resetRequest) throw new AppError("Request not found", 404);

  if (resetRequest.resetTokenUsed)
    throw new AppError("Invalid reset token", 401);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.findOneAndUpdate(
    { email: payload.email },
    { password: hashedPassword },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await passwordReset.findOneAndUpdate(
    { email: payload.email },
    { resetTokenUsed: true },
  );

  return { message: "Password reset successfully" };
};
