"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { User, VerifyTokenResponse } from "@/types/api";
import { authKeys } from "@/lib/query-keys";
import { getToken, removeToken, setToken } from "./auth-utils";
import { LoginCredentials } from "@/types/api";
import { Box, Spinner } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const colors = useColors();

  const { data: verifyResponse, isLoading: isVerifying } = useQuery({
    queryKey: authKeys.current(),
    queryFn: authApi.verifyToken,
    enabled: !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (verifyResponse?.success) {
      console.log("Token verification successful:", verifyResponse);
      setUser({
        uuid: verifyResponse.data.userId,
        username: verifyResponse.data.username,
        name: verifyResponse.data.username,
        email: "",
        role: verifyResponse.data.role,
        status: "ACTIVE",
        createdAt: "",
        updatedAt: "",
      });
      setIsAuthenticated(true);
    } else if (!isVerifying && getToken()) {
      console.log("Token verification failed, removing token");
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [verifyResponse, isVerifying]);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data?.data?.accessToken) {
        console.log("Login successful, setting token:", data.data.accessToken);
        setToken(data.data.accessToken);
        setUser(data.data.user);
        setIsAuthenticated(true);
        router.push("/cms");
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      console.log("Logout successful, removing token");
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/cms/login");
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    return logoutMutation.mutateAsync();
  };

  if (!isInitialized || isVerifying) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg={colors.bg}
      >
        <Spinner size="xl" color={colors.primary.default} />
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: isVerifying,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
