import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { AppError } from "../../utils/appError.js";
import { transporter } from "../../config/mail.js";
import { passwordReset } from "../../models/passwordReset.js";
import { userModel as User } from "../../models/user.model.js";
import { pendingRegistration } from "../../models/pendingRegistration.model.js";
import type { resendOtpT } from "../../schemas/auth.schema.js";

export const resendOtpService = async (data: resendOtpT) => {
  if (data.type === "registration") {
    const user = await pendingRegistration.findOne({ email: data.email });

    if (!user) throw new AppError("Registration not found", 404);

    const now = Date.now();
    if (now - user.lastOtpSentAt.getTime() < 60 * 1000)
      throw new AppError(
        "Please wait 60 seconds before requesting a new OTP",
        429,
      );

    const otp = crypto.randomInt(100000, 1000000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pendingRegistration.updateOne(
      { _id: user._id },
      { otpHash: hashedOtp, otpExpiresAt, lastOtpSentAt: now, otpAttempts: 0 },
    );

    await transporter.sendMail({
      from: `"GreenEye Team" <${process.env.GOOGLE_USER_EMAIL}>`, // sender address
      to: data.email, // list of recipients
      subject: "OTP Verification", // subject line
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
            <h2 style="margin-bottom: 20px;">Verify Your Email</h2>
      
            <p>Hello ${user.name},</p>
      
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
      message: "A new OTP has been sent to your email.",
    };
  } else if (data.type === "forget_password") {
    const user = await User.findOne({ email: data.email });

    if (!user)
      return {
        message:
          "If an account exists with this email, you will receive an OTP.",
      };

    const resetRequest = await passwordReset.findOne({ email: data.email });
    if (!resetRequest) throw new AppError("Request not found", 404);

    const now = Date.now();
    if (now - resetRequest.lastOtpSentAt.getTime() < 60 * 1000)
      throw new AppError(
        "Please wait 60 seconds before requesting a new OTP",
        429,
      );

    const otp = crypto.randomInt(100000, 1000000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await passwordReset.updateOne(
      { email: resetRequest.email },
      { otpHash: hashedOtp, otpExpiresAt, lastOtpSentAt: now, otpAttempts: 0 },
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
      message: "If an account exists with this email, you will receive an OTP.",
    };
  }
  throw new AppError("Something went wrong", 500);
};
