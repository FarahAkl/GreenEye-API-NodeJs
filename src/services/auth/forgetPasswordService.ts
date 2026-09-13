import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { AppError } from "../../utils/appError.js";
import { transporter } from "../../config/mail.js";
import { passwordReset } from "../../models/passwordReset.js";
import { userModel as User } from "../../models/user.model.js";
import type { forgetPasswordT } from "../../schemas/auth.schema.js";

export const forgetPasswordService = async (data: forgetPasswordT) => {
  const user = await User.findOne({ email: data.email });

  if (!user) throw new AppError("User not found", 404);

  const otp = crypto.randomInt(100000, 1000000);
  const hashedOtp = await bcrypt.hash(otp.toString(), 10);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const forgetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const now = new Date();

  await passwordReset.findOneAndUpdate(
    { email: user.email },
    {
      otpHash: hashedOtp,
      otpExpiresAt,
      forgetPasswordExpiresAt,
      lastOtpSentAt: now,
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  await transporter.sendMail({
    from: `"GreenEye Team" <${process.env.GOOGLE_USER_EMAIL}>`, // sender address
    to: data.email, // list of recipients
    subject: "Reset Your Password", // subject line
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
  <h2 style="margin-bottom: 20px;">Reset Your Password</h2>

  <p>Hello ${user.name},</p>

  <p>
    We received a request to reset the password for your GreenEye account.
    Please use the verification code below to continue:
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
    If you didn't request a password reset, you can safely ignore this email.
  </p>

  <p style="margin-top: 30px;">
    Best regards,<br />
    GreenEye Team
  </p>
</div>
  `, // HTML body
  });

  return {
    message: "Check your email (or Spam)",
  };
};
