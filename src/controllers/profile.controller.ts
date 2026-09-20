import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/helper.js";
import { getProfileService } from "../services/profile/getProfileService.js";
import { AppError } from "../utils/appError.js";
import { deleteProfileService } from "../services/profile/deleteProfileService.js";
import { updateProfileService } from "../services/profile/updateProfileService.js";
import { updateProfileReqSchema } from "../schemas/profile.schema.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const getProfile = async (req: Request, res: Response) => {
  const payloadData = req.user;
  if (!payloadData) throw new AppError("Not Authenticated", 401);

  const result = await getProfileService(payloadData);

  return res.status(200).json(successResponse(result.message, result.data));
};

export const deleteProfile = async (req: Request, res: Response) => {
  const payloadData = req.user;
  if (!payloadData) throw new AppError("Not Authenticated", 401);

  const result = await deleteProfileService(payloadData);

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(successResponse(result.message));
};

export const updateProfile = async (req: Request, res: Response) => {
  const validatedReq = updateProfileReqSchema.safeParse(req.body);
  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const avatar = req.file;
  let avatarUrl: string | undefined;

  if (avatar) {
    const result = await uploadToCloudinary(avatar.buffer, "greeneye/avatars");
    avatarUrl = result.secure_url;
  }

  const validatedData = validatedReq.data;

  const payloadData = req.user;
  if (!payloadData) throw new AppError("Not Authenticated", 401);

  const result = await updateProfileService({
    payloadData,
    data: { ...validatedData, avatar: avatarUrl },
  });

  return res.status(200).json(successResponse(result.message, result.data));
};
