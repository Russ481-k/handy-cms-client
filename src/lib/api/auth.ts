import {
  LoginCredentials,
  AuthResponse,
  VerifyTokenResponse,
} from "@/types/api";
import { api } from "@/lib/api-client";

// React Query 키 정의
export const authKeys = {
  all: ["auth"] as const,
  current: () => [...authKeys.all, "current"] as const,
  login: () => [...authKeys.all, "login"] as const,
};

// 인증 관련 API 타입 정의
export interface AuthApi {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  verifyToken: () => Promise<VerifyTokenResponse>;
  logout: () => Promise<void>;
}

// 인증 API 구현
export const authApi: AuthApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.public.auth.login(credentials);
    return response;
  },
  logout: async () => {
    await api.private.auth.logout();
  },
  verifyToken: async () => {
    const response = await api.private.auth.verifyToken();
    return response;
  },
};
