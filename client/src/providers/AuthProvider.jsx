import { useEffect } from "react";
import { useAuth } from "../app/store/useAuth";
import { router } from "../app/api/rootRouter";
import jwtDecode from "jwt-decode";

/**
 * Provider zajmuję się odebraniem objektu użytkownika z local storage,
 * natomiast jeśli accesss token jest już nie ważny to zostaje wywołana
 * funkcja do odświeżenia tokenu TYLKO jeśli refresh token znajduje się w local storage
 */
export const AuthProvider = ({ children }) => {
  useEffect(() => {
    try {
      // tokeny i data wygaśnięcia access tokena w sekundach
      const access_token = localStorage.getItem("access_token");
      const refresh_token = localStorage.getItem("refresh_token");
      const expires_at = localStorage.getItem("expires_at") ?? NaN;

      // jeśli nie jakiegoś z  tokenów to wylogowanie użytkownika i zatrzymanie dalszego wykonywania
      if (!access_token || !refresh_token) {
        useAuth.getState().logout();
        return;
      }

      // sprawdzanie czy refresh jest wymagany po przez porównanie
      // aktualnej daty w sekundach do daty wygaśnięcia access tokena.
      // im data póżniejsza tym liczba jest większa
      const nowInSeconds = +(new Date().getTime() / 1000).toFixed();
      const isRefreshRequired = +expires_at < nowInSeconds;

      // jeśli refresh jest wymagany to zostaje wywołana funkcja 'auth.refresh'
      if (isRefreshRequired)
        router.auth
          .refresh()
          // w przypadku udanego refresha ładowanie zostaje zakończone
          .then(() => useAuth.setState({ isLoading: false }))

          // w przypadku błędu użytkownik jest wylogowywany
          .catch(() => useAuth.getState().logout());
      // w innym przypadku odbieramy objekt użytkownika z access tokena
      // i aktualizujemy useAuth currentUser state
      else {
        const user = jwtDecode(access_token);
        useAuth.setState({ currentUser: user, isLoading: false });
      }
    } catch (err) {
      // wylogowanie użytkownika i ostrzeżenie o nieudanej próbie pobrania użytkownika, itd.
      useAuth.getState().logout();
      console.warn("Nie udało się pobrać użytkownika");
    }
  }, []);

  return children;
};
