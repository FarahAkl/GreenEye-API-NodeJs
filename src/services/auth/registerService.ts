import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { AppError } from "../../utils/appError.js";
import { transporter } from "../../config/mail.js";
import { pendingRegistration } from "../../models/pendingRegistration.model.js";
import { userModel as User } from "../../models/user.model.js";
import type { registerReqT } from "../../schemas/auth.schema.js";


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
  const lastOtpSentAt = new Date();

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
    lastOtpSentAt,
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
