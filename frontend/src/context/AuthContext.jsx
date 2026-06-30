"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedToken = authService.getToken();
    const storedUser = authService.getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      setToken(result.token);
      setUser(result.user);
      return result;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const result = await authService.register(name, email, password);
      return result;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};