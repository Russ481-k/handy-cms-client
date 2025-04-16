"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys } from "@/lib/api/auth";
import { User } from "@/types/api";
import { setAuthToken, removeAuthToken, setUser, getUser } from "@/lib/auth";

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // 현재 인증 상태 확인
  const { data: user, isLoading: isVerifying } = useQuery({
    queryKey: authKeys.current(),
    queryFn: authApi.verifyToken,
    enabled: !!getUser(), // localStorage에 사용자 정보가 있을 때만 실행
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 로그인 뮤테이션
  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => authApi.login({ username, password }),
    onSuccess: (data) => {
      setAuthToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(authKeys.current(), data.user);
    },
  });

  const login = async (username: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ username, password });
      return {
        success: true,
        user: result.user,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "로그인에 실패했습니다.",
      };
    }
  };

  const logout = () => {
    removeAuthToken();
    queryClient.removeQueries({ queryKey: authKeys.all });
    router.replace("/cms/login");
  };

  // 인증이 필요한 페이지 접근 제어
  useEffect(() => {
    if (
      !isVerifying &&
      !user &&
      pathname.startsWith("/cms") &&
      pathname !== "/cms/login"
    ) {
      router.replace("/cms/login");
    }
  }, [isVerifying, user, pathname, router]);

  // 로딩 상태 계산
  const isLoading =
    isVerifying ||
    loginMutation.isPending ||
    (!!user && pathname === "/cms/login");

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user: user || null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
