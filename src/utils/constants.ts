const statusText = {
  SUCCESS: "success",
  FAIL: "fail",
  ERROR: "error",
};

const userRoles = {
  ADMIN: "admin",
  USER: "user",
  SUPPLIER: "supplier",
  EXPERT: "expert",
};

export const registerRoles = [
  userRoles.USER,
  userRoles.EXPERT,
  userRoles.SUPPLIER,
];

export { statusText, userRoles };
