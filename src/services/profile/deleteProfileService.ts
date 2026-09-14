import { userModel as User } from "../../models/user.model.js";
import type { AuthPayload } from "../../types/auth.js";
import { AppError } from "../../utils/appError.js";

export const deleteProfileService = async (data: AuthPayload) => {
  const user = await User.findByIdAndDelete(data.id);
  if (!user) throw new AppError("User not found", 404);

  return {
    message: "Profile deleted successfully",
  };
};
