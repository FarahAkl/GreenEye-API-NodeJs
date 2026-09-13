import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appError.js";
import { userModel as User } from "../../models/user.model.js";
import type { loginT } from "../../schemas/auth.schema.js";

export const loginService = async (data: loginT) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid email or password", 401);

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) throw new AppError("Invalid email or password", 401);

  const jwtAccessSecret = process.env.JWT_ACCESS_SECRET_KEY;
  if (!jwtAccessSecret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  const accessToken = jwt.sign(
    { id: user._id, email, role: user.role },
    jwtAccessSecret,
    {
      expiresIn: "15m",
    },
  );

  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_KEY;
  if (!jwtRefreshSecret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  const refreshToken = jwt.sign(
    { id: user._id, email, role: user.role },
    jwtRefreshSecret,
    {
      expiresIn: "7d",
    },
  );

  return {
    message: "Login Successfully",
    accessToken,
    refreshToken,
  };
};
