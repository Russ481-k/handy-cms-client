"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api-client";
import { User } from "@/types/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    message?: string;
    user?: User;
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setUser(null);
        if (pathname !== "/cms/login" && pathname.startsWith("/cms")) {
          router.replace("/cms/login");
        }
        return;
      }

      // 토큰이 있으면 인증 상태로 설정
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));

      // 로그인 페이지나 CMS 루트에서 대시보드로 리다이렉트
      if (pathname === "/cms/login" || pathname === "/cms") {
        router.replace("/cms/menu");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
      if (pathname !== "/cms/login" && pathname.startsWith("/cms")) {
        router.replace("/cms/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname]);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true); // 로그인 시작 시 로딩 상태로 설정
      const response = await api.private.login({ username, password });

      if (!response.data) {
        setIsLoading(false); // 실패 시 로딩 상태 해제
        return {
          success: false,
          message: response.message || "로그인에 실패했습니다.",
        };
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      setUser(response.data.user);

      // 로딩 상태는 유지하여 리다이렉트 전까지 사이드바가 보이지 않도록 함
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      setIsLoading(false); // 에러 시 로딩 상태 해제
      console.error("Login error:", error);
      return {
        success: false,
        message: "로그인 중 오류가 발생했습니다.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    router.replace("/cms/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
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
