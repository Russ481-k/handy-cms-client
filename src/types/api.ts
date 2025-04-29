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
  bbsName: string;
  skinType: "BASIC" | "FAQ" | "QNA" | "PRESS" | "FORM";
  manager: {
    name: string;
    email: string;
  };
  alarm: {
    mail: boolean;
    kakao: boolean;
    internal: boolean;
  };
  topContent: string;
  bottomContent: string;
  auth: {
    read: string;
    write: string;
    admin: string;
  };
  displayYn: boolean;
  sortOrder: number;
  extraSchema: {
    attachmentLimit: number;
    category: boolean;
    formDownloadYn: boolean;
    customFields: Array<{
      code: string;
      label: string;
      type: string;
      options: string[];
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  bbsId: number;
  title: string;
  contentHtml: string;
  writer: string;
  publishStartDt: string;
  attachments: number[];
  categories: string[];
  custom: Record<string, string>;
  parentNttId?: number;
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
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  widget?: {
    type: string;
    config?: Record<string, unknown>;
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
  templateName: string;
  type: "MAIN" | "SUB";
  description: string | null;
  published: boolean;
  versions?: TemplateVersion[];
  layout?: TemplateBlock[];
  displayPosition: "HEADER" | "FOOTER";
  visible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateData {
  templateName: string;
  templateType: string;
  description: string | null;
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
  bbsName: string;
  skinType: "BASIC" | "FAQ" | "QNA" | "PRESS" | "FORM";
  manager: {
    name: string;
    email: string;
  };
  alarm: {
    mail: boolean;
    kakao: boolean;
    internal: boolean;
  };
  topContent: string;
  bottomContent: string;
  auth: {
    read: string;
    write: string;
    admin: string;
  };
  displayYn: boolean;
  sortOrder: number;
  extraSchema: {
    attachmentLimit: number;
    category: boolean;
    formDownloadYn: boolean;
    customFields: Array<{
      code: string;
      label: string;
      type: string;
      options: string[];
    }>;
  };
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
  description: string | null;
  layout: TemplateBlock[];
  published?: boolean;
}
