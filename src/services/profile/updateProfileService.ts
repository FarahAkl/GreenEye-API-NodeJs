import { userModel as User } from "../../models/user.model.js";
import type { updateProfileT } from "../../schemas/profile.schema.js";
import type { AuthPayload } from "../../types/auth.js";
import { AppError } from "../../utils/appError.js";

export const updateProfileService = async ({
  data,
  payloadData,
}: {
  data: updateProfileT;
  payloadData: AuthPayload;
}) => {
  const user = await User.findByIdAndUpdate(payloadData.id, data, {
    returnDocument: "after",
    projection: { __v: 0, password: 0 },
  });
  if (!user) throw new AppError("User not found", 404);

  return {
    message: "Profile updated successfully",
    data: user,
  };
};
