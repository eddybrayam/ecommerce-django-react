import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { setSession, getUser, getAccess, getRefresh, clearSession } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const hasTokens = getAccess() || getRefresh();
        if (!hasTokens) {
          setLoading(false);
          return;
        }

        const me = await api.get("/api/accounts/me/");
        setUser(me.data);
        setSession({ access: getAccess(), refresh: getRefresh(), user: me.data });
      } catch (err) {
        console.warn("⚠️ Sesión inválida:", err?.message);
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signInWithTokens = async ({ access, refresh }) => {
    setSession({ access, refresh });
    const me = await api.get("/api/accounts/me/");
    setUser(me.data);
    setSession({ access, refresh, user: me.data });
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de acceso con fallback seguro
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn("⚠️ useAuth() usado fuera de <AuthProvider>");
    return { user: null, loading: false, logout: () => {} };
  }
  return context;
};
