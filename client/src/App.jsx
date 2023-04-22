import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "styled-components";
import Home from "./pages/Home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

const theme = {
  main: "#2563eb",
  secondary: "#f8fafc",
  rounded: {
    sm: "0.125rem",
    md: "0.375rem",
  },
  padding: {
    sm: ".25rem",
    md: ".75rem",
    lg: "1.5rem",
  },
  gray: {
    50: "#f1f5f9",
    200: "#e2e8f0",
    500: "#6b7280",
  },
  text: {
    error: "#ef4444",
  },
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
