import { transporter } from "../../config/mail.js";
import { userModel } from "../../models/user.model.js";

export const rejectUserService = async ({
  userId,
  userName,
  email,
  rejectReason,
}: {
  userId: string;
  userName: string;
  email: string;
  rejectReason: string;
}) => {
  await transporter.sendMail({
    from: `"GreenEye Team" <${process.env.GOOGLE_USER_EMAIL}>`, // sender address
    to: email, // list of recipients
    subject: "Registration Request Rejected", // subject line
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
  <h2 style="margin-bottom: 20px;">Registration Request Rejected</h2>

  <p>Hello ${userName},</p>

  <p>
    Thank you for your interest in joining GreenEye.
    Unfortunately, your registration request has been rejected.
  </p>

  ${
    rejectReason
      ? `
        <p>
          <strong>Reason for rejection:</strong>
        </p>

        <div style="
          margin: 15px 0;
          padding: 15px;
          background-color: #f8f8f8;
          border-left: 4px solid #d9534f;
          border-radius: 4px;
        ">
          ${rejectReason}
        </div>
      `
      : ""
  }

  <p>
    If you believe this was a mistake or you need further information,
    please contact the GreenEye team.
  </p>

  <p style="margin-top: 30px;">
    Best regards,<br />
    GreenEye Team
  </p>
</div>
      `, // HTML body
  });

  await userModel.findByIdAndUpdate(userId, { status: "rejected" });

  return { message: "User rejected successfully" };
};
