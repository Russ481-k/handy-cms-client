"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useColors } from "@/styles/theme";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    id: string,
    password: string
  ) => Promise<{
    success: boolean;
    message?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const colors = useColors();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        if (pathname !== "/cms/login" && pathname.startsWith("/cms")) {
          router.replace("/cms/login");
        }
        return;
      }

      // 토큰이 있으면 인증 상태로 설정
      setIsAuthenticated(true);

      // 로그인 페이지나 CMS 루트에서 대시보드로 리다이렉트
      if (pathname === "/cms/login" || pathname === "/cms") {
        router.replace("/cms/dashboard");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      if (pathname !== "/cms/login" && pathname.startsWith("/cms")) {
        router.replace("/cms/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (id: string, password: string) => {
    try {
      // API 호출
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        return {
          success: true,
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.message || "로그인에 실패했습니다.",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "로그인 중 오류가 발생했습니다.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.replace("/cms/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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
