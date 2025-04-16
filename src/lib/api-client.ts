import axios from "axios";
import {
  Menu,
  Content,
  Board,
  Post,
  User,
  LoginCredentials,
  AuthResponse,
  ContentData,
  BoardData,
  UserData,
} from "@/types/api";

// 현재 호스트를 기반으로 BASE_URL 설정
const BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}/api`
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// 인증이 필요하지 않은 API 요청을 위한 클라이언트
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 인증이 필요한 API 요청을 위한 클라이언트
export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// API 응답 에러 처리 인터셉터
[publicApi, privateApi].forEach((api) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/cms/login";
      }
      return Promise.reject(error);
    }
  );
});

// 인증 토큰 인터셉터
privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  api: typeof publicApi | typeof privateApi,
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: D
): ApiRequestFunction<T> => {
  return async () => {
    try {
      const response = await api.request({
        url: endpoint,
        method,
        data,
      });
      return {
        data: response.data as T,
        message: response.data.message,
        status: response.status,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred");
    }
  };
};

// API 요청 함수 예시
export const api = {
  // 인증이 필요하지 않은 API 요청 (메인 페이지용)
  public: {
    // 메뉴 관련
    getMenus: () => createApiRequest<Menu[]>(publicApi, "/menu")(),
    getMenu: (id: string) => createApiRequest<Menu>(publicApi, `/menu/${id}`)(),

    // 컨텐츠 관련
    getContents: () => createApiRequest<Content[]>(publicApi, "/content")(),
    getContent: (id: string) =>
      createApiRequest<Content>(publicApi, `/content/${id}`)(),

    // 게시판 관련
    getBoards: () => createApiRequest<Board[]>(publicApi, "/board")(),
    getBoard: (id: string) =>
      createApiRequest<Board>(publicApi, `/board/${id}`)(),
    getBoardPosts: (boardId: string) =>
      createApiRequest<Post[]>(publicApi, `/board/${boardId}/posts`)(),
    getPost: (boardId: string, postId: string) =>
      createApiRequest<Post>(publicApi, `/board/${boardId}/posts/${postId}`)(),

    get: async <T>(url: string) => {
      const response = await publicApi.get<T>(url);
      return response;
    },

    login: (credentials: LoginCredentials) =>
      publicApi.post<AuthResponse>("/auth/login", credentials),
    verifyToken: () => publicApi.get<User>("/auth/verify"),

    post: async <T>(url: string, data?: any) => {
      const response = await publicApi.post<T>(url, data);
      return response;
    },
  },

  // 인증이 필요한 API 요청 (CMS 관리용)
  private: {
    // 인증 관련
    login: (credentials: LoginCredentials) =>
      createApiRequest<AuthResponse>(
        publicApi,
        "/auth/login",
        "POST",
        credentials
      )(),

    // CMS 컨텐츠 관리
    getCmsContents: () =>
      createApiRequest<Content[]>(privateApi, "/cms/content")(),
    createCmsContent: (data: ContentData) =>
      createApiRequest<Content>(privateApi, "/cms/content", "POST", data)(),
    updateCmsContent: (id: string, data: ContentData) =>
      createApiRequest<Content>(
        privateApi,
        `/cms/content/${id}`,
        "PUT",
        data
      )(),
    deleteCmsContent: (id: string) =>
      createApiRequest<void>(privateApi, `/cms/content/${id}`, "DELETE")(),

    // CMS 게시판 관리
    getCmsBoards: () => createApiRequest<Board[]>(privateApi, "/cms/board")(),
    createCmsBoard: (data: BoardData) =>
      createApiRequest<Board>(privateApi, "/cms/board", "POST", data)(),
    updateCmsBoard: (id: string, data: BoardData) =>
      createApiRequest<Board>(privateApi, `/cms/board/${id}`, "PUT", data)(),
    deleteCmsBoard: (id: string) =>
      createApiRequest<void>(privateApi, `/cms/board/${id}`, "DELETE")(),

    // CMS 사용자 관리
    getCmsUsers: () => createApiRequest<User[]>(privateApi, "/cms/users")(),
    getCmsUser: (id: string) =>
      createApiRequest<User>(privateApi, `/cms/users/${id}`)(),
    updateCmsUser: (id: string, data: UserData) =>
      createApiRequest<User>(privateApi, `/cms/users/${id}`, "PUT", data)(),
    deleteCmsUser: (id: string) =>
      createApiRequest<void>(privateApi, `/cms/users/${id}`, "DELETE")(),

    get: async <T>(url: string) => {
      const response = await privateApi.get<T>(url);
      return response;
    },

    post: async <T>(url: string, data?: any) => {
      const response = await privateApi.post<T>(url, data);
      return response;
    },

    put: async <T>(url: string, data?: any) => {
      const response = await privateApi.put<T>(url, data);
      return response;
    },

    delete: async <T>(url: string) => {
      const response = await privateApi.delete<T>(url);
      return response;
    },
  },
};
