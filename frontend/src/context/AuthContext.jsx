import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { setSession, getUser, getAccess, getRefresh, clearSession } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  // Auto-login al abrir/recargar
  useEffect(() => {
    (async () => {
      try {
        const hasTokens = getAccess() || getRefresh();
        if (!hasTokens) return;
        const me = await api.get("/api/accounts/me/");
        setUser(me.data);
        setSession({ access: getAccess(), refresh: getRefresh(), user: me.data });
      } catch {
        clearSession();
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

export const useAuth = () => useContext(AuthContext);
