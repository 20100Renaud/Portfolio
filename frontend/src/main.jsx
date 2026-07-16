import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { AboutProvider } from "./context/AboutContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AboutProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </AboutProvider>
    </AuthProvider>
  </StrictMode>,
);
