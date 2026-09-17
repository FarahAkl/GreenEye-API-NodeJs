import bcrypt from "bcryptjs";

import { userModel } from "../models/user.model.js";
import { userRoles } from "../utils/constants.js";

export const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Admin environment variables are not configured");
  }

  const existingAdmin = await userModel.findOne({
    email,
    role: userRoles.ADMIN,
  });

  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await userModel.create({
    name: "Admin",
    email,
    password: hashedPassword,
    address: "GreenEye",
    phoneNumber: "01234567890",
    role: userRoles.ADMIN,
    status: "approved",
  });

  console.log("Default admin created successfully");
};
