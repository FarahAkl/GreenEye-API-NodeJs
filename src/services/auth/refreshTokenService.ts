import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appError.js";

export const refreshTokenService = (refreshToken: string) => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_KEY;
  if (!jwtRefreshSecret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(refreshToken, jwtRefreshSecret);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  if (
    typeof payload === "string" ||
    typeof payload.id !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.role !== "string"
  ) {
    throw new AppError("Invalid refresh token", 401);
  }
  const jwtAccessSecret = process.env.JWT_ACCESS_SECRET_KEY;
  if (!jwtAccessSecret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  const accessToken = jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role },
    jwtAccessSecret,
    {
      expiresIn: "15m",
    },
  );

  return { message: "Access token refreshed successfully", accessToken };
};
