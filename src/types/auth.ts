import type { UserRoleT } from "../utils/constants.js";

export type AuthPayload = {
  id: string;
  email: string;
  role: UserRoleT;
};
