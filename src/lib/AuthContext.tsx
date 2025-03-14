"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "./auth-utils";
import {
  getAuthToken,
  getUser,
  isAuthenticated as checkIsAuthenticated,
  login as authLogin,
  logout as authLogout,
} from "./auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status on mount and token changes
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        const authenticated = !!token;
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const userData = getUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authLogin({ username, password });
      setUser(response.user);
      setIsAuthenticated(true);
      window.location.href = "/cms/dashboard";
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/cms/login";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
