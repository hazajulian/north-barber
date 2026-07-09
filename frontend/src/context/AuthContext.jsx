// AuthContext.jsx
// Maneja el estado global de autenticación del administrador.

import {
  createContext,
  useEffect,
  useState,
} from "react";

import { loginAdmin } from "../services/authService";

const TOKEN_KEY = "north_barber_token";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [admin, setAdmin] = useState(null);

  const isAuthenticated = Boolean(token);

  async function login(credentials) {
    const data = await loginAdmin(credentials);

    const receivedToken =
      data?.token ??
      data?.data?.token;

    const receivedAdmin =
      data?.admin ??
      data?.data?.admin ??
      null;

    if (!receivedToken) {
      throw new Error(
        "No se recibió token del servidor"
      );
    }

    localStorage.setItem(
      TOKEN_KEY,
      receivedToken
    );

    setToken(receivedToken);
    setAdmin(receivedAdmin);

    return data;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);

    setToken(null);
    setAdmin(null);
  }

  useEffect(() => {
    if (!token) {
      setAdmin(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}