import { api } from "..";

export const authRouter = {
  /**
   * @POST
   * Zamienia `refresh_token` na `access_token` jeśli znajduje się w localStorage,
   * w innym przypadku zapytanie się nie wykonuje.
   */
  refresh: async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) await api.post("/auth/refresh", { refresh_token });
  },

  /**
   * @POST
   * Zwraca użytkownika, access i refresh roken oraz date wygaśnięcia access tokena.
   */
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * @POST
   * Zwraca użytkownika, access i refresh roken oraz date wygaśnięcia access tokena.
   */
  register: async (name, email, password, avatarUrl) => {
    const response = await api.post("/auth/register", { name, email, password, avatarUrl });
    return response.data;
  },
};
