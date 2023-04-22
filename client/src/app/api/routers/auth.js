import { api } from "..";

export const authRouter = {
  /**
   * @GET
   * @param {string} userId - id użytkownika
   * @returns Zwraca objekt użytkownika lub `null` w przypadku braku znalezienia.
   */
  getUserById: async (userId) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response?.data?.user ?? null;
  },

  /**
   * @POST
   * @description Zamienia `refresh_token` na `access_token` jeśli znajduje się w localStorage,
   * w innym przypadku zapytanie się nie wykonuje.
   */
  refresh: async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) await api.post("/auth/refresh", { refresh_token });
  },

  /**
   * @POST
   * @param {string} email
   * @param {string} password
   * @returns Zwraca użytkownika, access i refresh roken oraz date wygaśnięcia access tokena.
   */
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * @POST
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {object} optional
   * @returns Zwraca użytkownika, access i refresh roken oraz date wygaśnięcia access tokena.
   */
  register: async (name, email, password, optional) => {
    const avatarUrl = optional?.avatarUrl ?? undefined;
    const response = await api.post("/auth/register", { name, email, password, avatarUrl });
    return response.data;
  },
};
