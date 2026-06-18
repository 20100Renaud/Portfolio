import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(true);
        setUsername(data.username);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUsername(null);
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
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
