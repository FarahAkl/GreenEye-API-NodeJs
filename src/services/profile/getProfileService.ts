import { userModel as User } from "../../models/user.model.js";
import type { AuthPayload } from "../../types/auth.js";
import { AppError } from "../../utils/appError.js";

export const getProfileService = async (data: AuthPayload) => {
  const user = await User.findById(data.id, { __v: false, password: false });

  if (!user) throw new AppError("User not found", 404);

  return {
    message: "Profile fetched successfully",
    data: user,
  };
};
