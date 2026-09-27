import { transporter } from "../../config/mail.js";
import { product } from "../../models/product.model.js";

export const rejectProductService = async ({
  productId,
  userName,
  email,
  productName,
  rejectReason,
}: {
  productId: string;
  userName: string;
  email: string;
  productName: string;
  rejectReason: string;
}) => {
  await product.findByIdAndUpdate(productId, { status: "rejected" });

  await transporter.sendMail({
    from: `"GreenEye Team" <${process.env.GOOGLE_USER_EMAIL}>`, // sender address
    to: email, // list of recipients
    subject: "Product Submission Rejected", // subject line
    html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;"> <h2 style="margin-bottom: 20px;">Product Submission Rejected</h2>

<p>Hello ${userName},</p>

<p> Your product submission has been reviewed by the GreenEye team and, unfortunately, it has been rejected. </p>

<p> <strong>Product:</strong> ${productName} </p>

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
  

<p> Please review the feedback and make the necessary changes before submitting your product again. </p>

<p> If you believe this was a mistake or need further information, please contact the GreenEye team. </p>

<p style="margin-top: 30px;"> Best regards,<br /> GreenEye Team </p> </div>
      `, // HTML body
  });

  return { message: "Product rejected successfully" };
};
