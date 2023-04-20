import { api } from "../index.js";

export const getUserById = async (userId) => {
  return api.get(`/auth/user/${userId}`);
};
