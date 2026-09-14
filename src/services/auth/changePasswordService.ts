import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { changePasswordT } from "../../schemas/auth.schema.js";
import { userModel as User } from "../../models/user.model.js";
import { AppError } from "../../utils/appError.js";
import type { AuthPayload } from "../../types/auth.js";

export const changePasswordService = async ({
  data,
  payloadData,
}: {
  data: changePasswordT;
  payloadData: AuthPayload;
}) => {
  const user = await User.findById({ _id: payloadData.id });
  if (!user) throw new AppError("User not Found", 404);

  const validPassword = await bcrypt.compare(data.old_password, user.password);
  if (!validPassword) throw new AppError("Old password is wrong", 400);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await User.updateOne(
    { email: payloadData.email },
    { password: hashedPassword },
  );

  return { message: "Password changed successfully" };
};
