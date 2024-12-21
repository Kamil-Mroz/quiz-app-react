import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./AuthProvider.tsx";
import { FormProviderQuiz } from "./hooks/froms.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <FormProviderQuiz>
        <App />
      </FormProviderQuiz>
    </AuthProvider>
  </StrictMode>
);
