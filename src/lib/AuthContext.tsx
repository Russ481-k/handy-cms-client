"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthResponse,
  getAuthToken,
  getUser,
  isAuthenticated as checkIsAuthenticated,
  login as authLogin,
  logout as authLogout,
} from "./auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse["user"] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = checkIsAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        setUser(getUser());
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authLogin({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      router.push("/cms/dashboard");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/cms/login");
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
