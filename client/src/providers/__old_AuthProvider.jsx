import { useEffect } from "react";
import { useAuth } from "../app/store/useAuth";
import { router } from "../app/api/rootRouter";
import jwtDecode from "jwt-decode";
import { useMutation } from "@tanstack/react-query";

/**
 * @description Provider zajmuję się odświerzaniem tokenów użytkownika podczas pierwszego odpalenia strony.
 * Innymi słowami sprawdza czy użytkownik (nie) jest zalogowany.
 *
 */
export const AuthProvider = ({ children }) => {
  // odświerzanie tokenów, w teroii mogło by być po prostu `router.auth.refresh()`
  const { mutateAsync } = useMutation({
    mutationKey: ["initial_refresh"],
    mutationFn: () => router.auth.refresh(),
  });

  // mutacja, która odpala się RAZ podczas pierwszego odpalenia strony
  useEffect(() => {
    // W teroii wystarczyło by odpalenie samej mutacji, ale wtedy nie było by możliwości
    // sprawdzania, kiedy użytkownik ma np. nieznany status uwierzytelniania oraz doszło by
    // do problemu gdy odpalana jest jaka kolwiek funkcja, która zwraca jakiś token to
    // na moment był by status
    mutateAsync()
      .then(() => {
        // odbieranie access tokena z local storage, jest to możliwe,
        // ponieważ w konfiguracji api domyślnie wszystkie tokeny są od razu
        // przekazywane do local storage
        const access_token = localStorage.getItem("access_token");

        // użytkownik wyjęty z access tokena
        const user = jwtDecode(access_token);

        // jeśli użytkownik znajdował się w access tokenie to zaktualizowanie statów
        if (user) useAuth.setState({ currentUser: user, isLoading: false });
        // w innym przypadku wylogowanie użytkownika
        // (w teorii i tak w tym momencie nie jest zalogowany, ale za to staty są czyszczone)
        // powody: nieprawidłowy token, token jest już nie ważny (prawdopodobnie nie możliwe)
        else useAuth.getState().logout();
      })
      .catch((err) => {
        console.warn(err);

        // wylogowanie użytkownika, jeśli wystąpił by błąd, np. serwer nie odpowiada
        // znów funkcja 'auth.logout' służy raczej jako czyszczenie statów
        useAuth.getState().logout();
      });
  }, []);

  return <div>{children}</div>;
};
