import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    setIsAuthenticated(true);
    setUsername(data.username);
    setUser(data);

    return data;
  };

  useEffect(() => {
    refreshUser()
      .catch(() => {
        setIsAuthenticated(false);
        setUsername(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const login = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setUsername(null);
    setUser(null);
  };

  useEffect(() => {
    console.log("[AUTH]", {
      isAuthenticated,
      username,
      user,
    });
  }, [isAuthenticated, username, user]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, user, login: refreshUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
