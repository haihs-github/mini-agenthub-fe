import React from "react";
import { AuthProvider } from "./features/auth/AuthContext";
import { ToastProvider } from "./components/Toast";
import LoginForm from "./features/auth/components/LoginForm";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LoginForm />
      </ToastProvider>
    </AuthProvider>
  );
}
export default App;
