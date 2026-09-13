import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { userModel as User } from "../models/user.model.js";
import type {
  loginT,
  registerReqT,
  verifyOtpT,
} from "../schemas/auth.schema.js";
import { pendingRegistration } from "../models/pendingRegistration.model.js";
import { transporter } from "../config/mail.js";
import { AppError } from "../utils/appError.js";
import jwt from "jsonwebtoken";

export const registerService = async (data: registerReqT) => {
  const { email, name, password, address, phoneNumber, role, avatar } = data;
  const existUser = await User.findOne({ email });
  const pendingUser = await pendingRegistration.findOne({ email });

  if (existUser || pendingUser) throw new AppError("User already exists!", 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = crypto.randomInt(100000, 1000000);
  const hashedOtp = await bcrypt.hash(otp.toString(), 10);

  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const registerExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await pendingRegistration.create({
    email,
    name,
    password: hashedPassword,
    address,
    phoneNumber,
    role,
    ...(avatar && { avatar }),
    otpHash: hashedOtp,
    otpExpiresAt,
    registerExpiresAt,
  });

  await transporter.sendMail({
    from: `"GreenEye Team" <${process.env.GOOGLE_USER_EMAIL}>`, // sender address
    to: email, // list of recipients
    subject: "OTP Verification", // subject line
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
      <h2 style="margin-bottom: 20px;">Verify Your Email</h2>

      <p>Hello ${name},</p>

      <p>
        Thank you for registering. Please use the verification code below
        to verify your email address:
      </p>

      <div style="margin: 30px 0; text-align: center;">
        <span style="
          display: inline-block;
          padding: 15px 25px;
          background-color: #f4f4f4;
          border-radius: 8px;
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 6px;
        ">
          ${otp}
        </span>
      </div>

      <p>
        This code will expire in <strong>10 minutes</strong>.
      </p>

      <p>
        If you didn't create an account, you can safely ignore this email.
      </p>

      <p style="margin-top: 30px;">
        Best regards,<br />
        GreenEye Team
      </p>
    </div>
  `, // HTML body
  });

  return {
    message: "Registration successful. OTP sent to your email.",
    data: { email, name, address, phoneNumber, role, avatar },
  };
};

export const verifyOtpService = async (data: verifyOtpT) => {
  const { email, type, otp } = data;

  if (type === "registration") {
    const pendingUser = await pendingRegistration.findOne({ email });

    if (!pendingUser) throw new AppError("User not found", 404);

    if (new Date() > pendingUser.otpExpiresAt) {
      throw new AppError("OTP expired", 400);
    }

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

  throw new AppError("Invalid verification type", 400);
};

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
