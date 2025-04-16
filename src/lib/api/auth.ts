import { api } from "@/lib/api-client";
import { LoginCredentials, AuthResponse, User } from "@/types/api";

// React Query 키 정의
export const authKeys = {
  all: ["auth"] as const,
  current: () => [...authKeys.all, "current"] as const,
  login: () => [...authKeys.all, "login"] as const,
};

// 인증 관련 API 타입 정의
export interface AuthApi {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  verifyToken: () => Promise<User>;
  logout: () => Promise<void>;
}

// 인증 API 구현
export const authApi: AuthApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.private.login(credentials);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.private.verifyToken();
    return response.data;
  },

  logout: async () => {
    // 서버 측 로그아웃이 필요한 경우 여기에 구현
    return Promise.resolve();
  },
};
