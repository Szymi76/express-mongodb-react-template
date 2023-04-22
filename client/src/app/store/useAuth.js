import { create } from "zustand";
import { router } from "../api/rootRouter";

export const useAuth = create((set, get) => ({
  /**
   * Objekt aktualnie zalogowanego użytkownika, lub `null` jeśli użytkownik nie jest zalogowany.
   */
  currentUser: null,
  /**
   * Jest `true`, jeśli nie wiadomo czy użytkownik jest (nie) zalogowany, w przeciwnym przypadku `false`.
   */
  isLoading: true,
  /**
   * Pobiera na nowo aktualnie zalogowanego użytkownika.
   */
  refetch: async () => {
    if (!get().currentUser) return;
    try {
      await router.auth.refresh();
    } catch (err) {
      console.warn("Nie udało się odświerzyć aktualnie zalogowanego użytkownika");
    }
  },
  /**
   * Czyści wszystkie state i usuwa tokeny z local storage
   */
  logout: () => {
    set({ currentUser: null, isLoading: false });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
  },
}));
