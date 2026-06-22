import React, { createContext, useContext, useMemo, useState } from "react";
import { api, setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signin = async (email, password) => {
    const r = await api.post("/auth/signin", { email, password });
    setUser(r.user);
    setToken(r.token);
    setAuthToken(r.token);
    return r;
  };

  const signup = async (name, email, password) => {
    return api.post("/auth/signup", { name, email, password });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      // backend manda type como "Admin"/"Comum" no objeto user (no JWT vem 0/1)
      isAdmin: user?.type === 0 || user?.type === "0" || user?.type === "Admin",
      signin,
      signup,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
};
