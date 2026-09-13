export const userRoles = {
  ADMIN: "admin",
  USER: "user",
  SUPPLIER: "supplier",
  EXPERT: "expert",
} as const;

export type UserRoleT = (typeof userRoles)[keyof typeof userRoles];

export const registerRoles = [
  userRoles.USER,
  userRoles.EXPERT,
  userRoles.SUPPLIER,
];
