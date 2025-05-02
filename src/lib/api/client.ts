import axios, { AxiosInstance } from "axios";
import {
  getToken,
  removeToken,
  getRefreshToken,
  setToken,
} from "../auth-utils";

// Java 백엔드 서버 주소 설정
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// API 클라이언트 생성 함수
const createApiClient = (isPrivate: boolean): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // 공통 에러 처리
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (originalRequest.url === "/auth/refresh") {
        removeToken();
        window.location.href = "/cms/login";
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshToken();
          console.log("refreshToken:", refreshToken);
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const refreshClient = axios.create({
            baseURL: BASE_URL,
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });

          const response = await refreshClient.post("/auth/refresh", {
            refreshToken,
          });

          if (response.data?.success && response.data?.data?.accessToken) {
            setToken(
              response.data.data.accessToken,
              response.data.data.refreshToken
            );
            originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          removeToken();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // private API에만 토큰 인터셉터 추가
  if (isPrivate) {
    client.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token.trim()}`;
        }
        return config;
      },
      (error) => {
        console.error("[Private API Request Error]:", error);
        return Promise.reject(error);
      }
    );
  }

  return client;
};

// API 클라이언트 인스턴스
const publicApiClient = createApiClient(false);
const privateApiClient = createApiClient(true);

// API 메서드 생성 함수
const createApiMethods = (client: AxiosInstance) => ({
  get: async <T>(endpoint: string, config?: any) => {
    const response = await client.get<T>(endpoint, config);
    return response.data as T;
  },
  post: async <T, D = unknown>(endpoint: string, data?: D) => {
    const response = await client.post<T>(endpoint, data);
    return response.data;
  },
  put: async <T, D = unknown>(endpoint: string, data?: D) => {
    const response = await client.put<T>(endpoint, data);
    return response.data;
  },
  patch: async <T, D = unknown>(endpoint: string, data?: D) => {
    const response = await client.patch<T>(endpoint, data);
    return response.data;
  },
  delete: async <T>(endpoint: string) => {
    const response = await client.delete<T>(endpoint);
    return response.data;
  },
});

// Export API methods
export const publicApi = createApiMethods(publicApiClient);
export const privateApi = createApiMethods(privateApiClient);
