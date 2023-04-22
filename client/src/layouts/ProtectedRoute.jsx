import { Navigate } from "react-router-dom";
import { useAuth } from "../app/store/useAuth";

/**
 *
 * Jeśli, jako prop element zostanie podana strona w ruterze,
 * to jeśli użytkownik jest zalogowany to zostanie po prostu
 * pokazana strona w innym przypadku przekierowanie do np. strony z logowaniem
 * UWAGA: w App.js wyżej znajduje się Layout odpowiadający za czekanie
 * na to czy użytkownik (nie) jest zalogowany, więc nie może dojść do sytuacji
 * w której użytkownik został przekierowany gdy jeszcze nie wiadomo było
 * czy jest zalogowany.
 */
export const ProtectedRoute = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/" replace />;
  return element;
};
