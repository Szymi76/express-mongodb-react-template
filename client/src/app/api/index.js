import axios from "axios";
import jwtDecode from "jwt-decode";
import { useAuth } from "../store/useAuth";
import { router } from "./rootRouter";

// główny fetcher dzięki któremu pobieramy dane z serwera
export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
});

// request interceptor - czyli akcje które odbywają się przed wysłaniem każdego zapytania
api.interceptors.request.use(
  function (config) {
    // jeśli w local storage znajduje się access token to zostaje on dodany do zapytania
    // w headerze 'Authorization'
    const access_token = localStorage.getItem("access_token");
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;

    return config;
  },
  function (error) {
    // akcja, która odbywa się podczas błędu przed wysłaniem zapytania
    return Promise.reject(error);
  }
);

// response interceptor - czyli akcje, które odbywają się po odebraniu każdego zapytania
api.interceptors.response.use(
  function (response) {
    // odbieranie tokenów, itd.
    const { access_token, refresh_token, expires_at } = response.data;

    // jeśli access_token został przekazany to zostaje on dodany do local storage
    // oraz dekodowany jest z niego użytkownik, który jest aktualizowany w
    // 'useAuth' state. Więc jeśli np. po aktualizacji danych użytkownika
    // jeśli został w odpowiedzi przekazany access token to automatycznie
    // state z aktualnym użytkownikiem zostanie zaktualizowany.
    if (access_token) {
      localStorage.setItem("access_token", access_token);
      const currentUser = jwtDecode(access_token);
      if (currentUser) useAuth.setState({ currentUser });
    }

    // dodawanie do local storage refresh tokena i daty wygaśnięcia access tokena w sekundach
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
    if (expires_at) localStorage.setItem("expires_at", expires_at);

    return response;
  },
  function (error) {
    const originalRequest = error.config;
    const status = error.response.status;
    const isFirstRetry = !originalRequest._retry;

    // jeśli w odpowiedzi został zwrócony status 403 - czyli dostęp do zasobów został zabroniony,
    // to TYLKO raz ponawiana jest próba ponownego zapytania do oryginalnego zapytania po odświeżeniu
    // access tokena, jeśli coś pójdzie nie tak to użytkownik zostaje wylogowany
    if (status == 403 && isFirstRetry) {
      originalRequest._retry = true;

      // jeśli nie ma refresh tokena to nie odświeżać tokena
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) return;
      return router.auth.refresh().then(() => {
        const new_access_token = localStorage.getItem("access_token");
        originalRequest.headers.Authorization = `Bearer ${new_access_token}`;
        return api(originalRequest);
      });
    } else if (!isFirstRetry) useAuth.getState().logout();

    return Promise.reject(error);
  }
);

// /**
//  *
//  * == NA TEN MOMENT NIE DZIAŁA! ==
//  *
//  * @param {*} fetcher asynchroniczna funkcja pobierająca dane z serwera
//  * @returns Zwraca funkcje pobierającą, jeśli w local storage znajduje się
//  * access token w przeciwnym wypadku zwraca asynchorniczną funkcje zwracającą `null`.
//  */

// export const withAuth = (fetcher) => {
//   const currentUser = useAuth.getState().currentUser;
//   console.log(currentUser);
//   if (currentUser) return fetcher;
//   else
//     return async function () {
//       return null;
//     };
// };
