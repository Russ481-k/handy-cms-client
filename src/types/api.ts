// 기본 타입 정의
export interface Menu {
  id: number;
  name: string;
  type: "LINK" | "FOLDER" | "BOARD" | "CONTENT";
  url?: string;
  targetId?: number;
  displayPosition: string;
  visible: boolean;
  sortOrder: number;
  parentId?: number;
  children?: Menu[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: number;
  title: string;
  content: string;
  type: string;
  parentId?: number;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: number;
  name: string;
  slug: string;
  type: string;
  useCategory: boolean;
  allowComment: boolean;
  useAttachment: boolean;
  postsPerPage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  boardId: number;
  title: string;
  content: string;
  authorId: number;
  categoryId?: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  uuid: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API 요청 데이터 타입
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MenuData {
  name: string;
  type: Menu["type"];
  url?: string;
  targetId?: number;
  displayPosition: string;
  visible: boolean;
  sortOrder: number;
  parentId?: number;
}

export interface ContentData {
  title: string;
  content: string;
  type: string;
  parentId?: number;
  sortOrder: number;
  isVisible: boolean;
}

export interface BoardData {
  name: string;
  slug: string;
  type: string;
  useCategory: boolean;
  allowComment: boolean;
  useAttachment: boolean;
  postsPerPage: number;
}

export interface UserData {
  username: string;
  email: string;
  role: string;
  status: string;
}
