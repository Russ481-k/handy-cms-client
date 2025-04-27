import axios, { AxiosInstance } from "axios";
import { getToken, removeToken } from "./auth-utils";
import {
  Menu,
  Content,
  Board,
  User,
  LoginCredentials,
  AuthResponse,
  ContentData,
  BoardData,
  UserData,
  MenuData,
  VerifyTokenResponse,
} from "@/types/api";

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
    withCredentials: false, // Always set to false for both public and private APIs
  });

  // 공통 에러 처리
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeToken();
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
          const trimmedToken = token.trim();
          config.headers.Authorization = `Bearer ${trimmedToken}`;
        }
        return config;
      },
      (error) => {
        console.error("[Private API Request Error]:", error);
        return Promise.reject(error);
      }
    );

    client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          removeToken();
          // 로그인 페이지로 리다이렉트
          window.location.href = "/cms/login";
        }
        return Promise.reject(error);
      }
    );
  }

  return client;
};

// API 클라이언트 인스턴스 생성
export const publicApi = createApiClient(false);
export const privateApi = createApiClient(true);

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// API 요청 함수 타입 정의
export type ApiRequestFunction<T> = () => Promise<ApiResponse<T>>;

// API 요청 함수 생성 헬퍼
export const createApiRequest = <T, D = unknown>(
  client: AxiosInstance,
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: D
): ApiRequestFunction<T> => {
  return async () => {
    try {
      const response = await client.request({
        url: endpoint,
        method,
        data,
      });

      // Java API 서버의 응답 구조에 맞게 수정
      if (response.data && typeof response.data === "object") {
        const apiResponse = {
          data: response.data,
          message: response.data.message || "",
          status: response.status,
        };
        return apiResponse;
      }

      console.warn("Unexpected response structure:", response.data);
      return {
        data: response.data as T,
        message: "",
        status: response.status,
      };
    } catch (error) {
      console.error("API Error:", error);
      if (axios.isAxiosError(error)) {
        throw {
          data: error.response?.data,
          message: error.response?.data?.message || error.message,
          status: error.response?.status || 500,
        };
      }
      throw error;
    }
  };
};

// API 메서드 생성 함수
const createApiMethods = (client: AxiosInstance) => ({
  get: <T>(endpoint: string) => createApiRequest<T>(client, endpoint, "GET")(),
  post: <T, D = unknown>(endpoint: string, data?: D) =>
    createApiRequest<T, D>(client, endpoint, "POST", data)(),
  put: <T, D = unknown>(endpoint: string, data?: D) =>
    createApiRequest<T, D>(client, endpoint, "PUT", data)(),
  delete: <T>(endpoint: string) =>
    createApiRequest<T>(client, endpoint, "DELETE")(),
});

// API 요청 함수 모음
export const api = {
  // 인증이 필요하지 않은 API 요청 (메인 페이지용)
  public: {
    ...createApiMethods(publicApi),
    menu: {
      getMenus: () => createApiRequest<Menu[]>(publicApi, "/cms/menu/public")(),
    },
    // 인증 관련 API
    auth: {
      login: (credentials: LoginCredentials) =>
        createApiRequest<AuthResponse, LoginCredentials>(
          publicApi,
          "/auth/login",
          "POST",
          credentials
        )(),
      logout: () => createApiRequest<void>(publicApi, "/auth/logout", "POST")(),
    },
  },

  // 인증이 필요한 API 요청 (CMS 관리용)
  private: {
    ...createApiMethods(privateApi),

    // 인증 관련 API
    auth: {
      verifyToken: () =>
        createApiRequest<VerifyTokenResponse>(
          privateApi,
          "/auth/verify",
          "GET"
        )(),
      logout: () =>
        createApiRequest<void>(privateApi, "/auth/logout", "POST")(),
    },
    // CMS 메뉴 관리
    menu: {
      getMenus: () => createApiRequest<Menu[]>(privateApi, "/cms/menu")(),
      getMenu: (id: string) =>
        createApiRequest<Menu>(privateApi, `/cms/menu/${id}`)(),
      createMenu: (data: MenuData) =>
        createApiRequest<Menu>(privateApi, "/cms/menu", "POST", data)(),
      updateMenu: (id: string, data: MenuData) =>
        createApiRequest<Menu>(privateApi, `/cms/menu/${id}`, "PUT", data)(),
      deleteMenu: (id: string) =>
        createApiRequest<void>(privateApi, `/cms/menu/${id}`, "DELETE")(),
    },

    // CMS 컨텐츠 관리
    content: {
      getContents: () =>
        createApiRequest<Content[]>(privateApi, "/cms/content")(),
      createContent: (data: ContentData) =>
        createApiRequest<Content>(privateApi, "/cms/content", "POST", data)(),
      updateContent: (id: string, data: ContentData) =>
        createApiRequest<Content>(
          privateApi,
          `/cms/content/${id}`,
          "PUT",
          data
        )(),
      deleteContent: (id: string) =>
        createApiRequest<void>(privateApi, `/cms/content/${id}`, "DELETE")(),
    },

    // CMS 게시판 관리
    board: {
      getBoards: () => createApiRequest<Board[]>(privateApi, "/cms/board")(),
      createBoard: (data: BoardData) =>
        createApiRequest<Board>(privateApi, "/cms/board", "POST", data)(),
      updateBoard: (id: string, data: BoardData) =>
        createApiRequest<Board>(privateApi, `/cms/board/${id}`, "PUT", data)(),
      deleteBoard: (id: string) =>
        createApiRequest<void>(privateApi, `/cms/board/${id}`, "DELETE")(),
    },

    // CMS 사용자 관리
    user: {
      getUsers: () => createApiRequest<User[]>(privateApi, "/cms/users")(),
      getUser: (id: string) =>
        createApiRequest<User>(privateApi, `/cms/users/${id}`)(),
      updateUser: (id: string, data: UserData) =>
        createApiRequest<User>(privateApi, `/cms/users/${id}`, "PUT", data)(),
      deleteUser: (id: string) =>
        createApiRequest<void>(privateApi, `/cms/users/${id}`, "DELETE")(),
    },
  },
};
