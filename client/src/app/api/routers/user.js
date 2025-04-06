import { api } from "..";

export const userRouter = {
  /**
   * @GET
   * Zwraca objekt użytkownika lub `null` w przypadku braku znalezienia.
   */
  getUserById: async (userId) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response?.data?.user ?? null;
  },
};
