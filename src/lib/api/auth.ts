import { api } from "@/lib/api-client";
import { LoginCredentials, AuthResponse, User } from "@/types/api";

// 인증 관련 API 타입 정의
export interface AuthApi {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  verifyToken: () => Promise<User>;
  logout: () => Promise<void>;
}

// React Query 키 정의
export const authKeys = {
  all: ["auth"] as const,
  current: () => [...authKeys.all, "current"] as const,
};

// 인증 API 구현
export const authApi: AuthApi = {
  login: async (credentials) => {
    const response = await api.public.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.private.get<User>("/auth/verify");
    return response.data;
  },

  logout: async () => {
    // 로그아웃은 서버에서 토큰을 무효화하는 작업이 필요할 수 있음
    // 현재는 클라이언트에서만 처리
    return Promise.resolve();
  },
};
