import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "styled-components";
import { AwaitForAuth } from "./layouts/AwaitForAuth";
import { PrimaryLayout } from "./layouts/PrimaryLayout";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { theme } from "./styles/theme";

import Home from "./pages/Home";

/**
 * Query client odpowiadający za działania hooków do zapytań
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

/**
 * Router całej aplikacji
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/tylko-dla-zalogowanych",
    element: <ProtectedRoute element={<h1>Jeśli to widzisz, oznacza to że jesteś zalogowany</h1>} />,
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AwaitForAuth>
            <PrimaryLayout>
              <RouterProvider router={router} />
            </PrimaryLayout>
          </AwaitForAuth>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
