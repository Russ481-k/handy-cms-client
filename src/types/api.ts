// 기본 타입 정의
export interface Menu {
  id: number;
  name: string;
  type: "LINK" | "FOLDER" | "BOARD" | "CONTENT";
  url?: string;
  targetId?: number;
  displayPosition: "HEADER" | "FOOTER";
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
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    user: User;
    refreshToken: string;
  };
  errorCode: string | null;
  stackTrace: string | null;
}

export interface MenuData {
  name: string;
  type: Menu["type"];
  url?: string;
  targetId?: number;
  displayPosition: "HEADER" | "FOOTER";
  visible: boolean;
  sortOrder: number;
  parentId?: number;
}

// Template related interfaces
export interface TemplateBlock {
  blockId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  widget: {
    type: string;
    contentId?: number;
    props?: Record<string, string>;
  };
}

export interface TemplateVersion {
  versionId: number;
  templateId: number;
  versionNo: number;
  layout: TemplateBlock[];
  updater: string;
  updatedAt: string;
}

export interface Template {
  id: number;
  name: string;
  type: "LINK" | "FOLDER" | "BOARD" | "CONTENT" | "MAIN" | "SUB";
  url?: string;
  targetId?: number;
  displayPosition: "HEADER" | "FOOTER";
  visible: boolean;
  sortOrder: number;
  parentId?: number;
  children?: Template[] | null;
  createdAt: string;
  updatedAt: string;
  // API specific fields
  templateName?: string;
  templateType?: string;
  description?: string;
  layout?: TemplateBlock[];
  published?: boolean;
  versions?: TemplateVersion[];
}

export interface TemplateData {
  templateName: string;
  templateType: string;
  description?: string;
  layout: TemplateBlock[];
  published?: boolean;
}

export interface TemplateListParams {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  type?: string;
  status?: string;
}

export interface TemplateListResponse {
  data: {
    content: Template[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
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
  password: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  groupId: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  message: string | null;
  data: {
    valid: boolean;
    userId: string;
    username: string;
    role: string;
  };
  errorCode: string | null;
  stackTrace: string | null;
}

export interface TemplateSaveDto {
  templateName: string;
  templateType: string;
  description?: string;
  layout: TemplateBlock[];
  published?: boolean;
}
