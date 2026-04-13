import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    api.me()
      .then((data) => setUser(data))
      .catch(() => {
        sessionStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password);
    sessionStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    sessionStorage.removeItem("token");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      checkingAuth,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, checkingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}