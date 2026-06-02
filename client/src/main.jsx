import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import getTheme from "./theme.js";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext.jsx";
import { Toaster } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function Main() {
  return (
    <CustomThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </CustomThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>,
);
