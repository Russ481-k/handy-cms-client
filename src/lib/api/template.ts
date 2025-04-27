const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export interface TemplateListParams {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  type?: string;
  status?: string;
}

export interface TemplateSaveDto {
  templateName: string;
  templateType: string;
  layout: any[];
  published?: boolean;
}

export const templateApi = {
  // 목록 조회
  getTemplates: async (params: TemplateListParams) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/cms/templates?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch templates");
    }

    return response.json();
  },

  // 상세 조회
  getTemplate: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/cms/templates/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch template");
    }

    return response.json();
  },

  // 등록
  createTemplate: async (data: TemplateSaveDto) => {
    const response = await fetch(`${API_BASE_URL}/cms/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create template");
    }

    return response.json();
  },

  // 수정
  updateTemplate: async (id: number, data: TemplateSaveDto) => {
    const response = await fetch(`${API_BASE_URL}/cms/templates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update template");
    }

    return response.json();
  },

  // 삭제
  deleteTemplate: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/cms/templates/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete template");
    }
  },

  // 공개/비공개 토글
  togglePublish: async (id: number, published: boolean) => {
    const response = await fetch(
      `${API_BASE_URL}/cms/templates/${id}/publish`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ published }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle template publish status");
    }

    return response.json();
  },

  // 버전 목록 조회
  getVersions: async (id: number) => {
    const response = await fetch(
      `${API_BASE_URL}/cms/templates/${id}/versions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch template versions");
    }

    return response.json();
  },

  // 버전 롤백
  rollbackVersion: async (id: number, versionNo: number) => {
    const response = await fetch(
      `${API_BASE_URL}/cms/templates/${id}/rollback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ versionNo }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to rollback template version");
    }

    return response.json();
  },

  // 미리보기
  previewTemplate: async (data: TemplateSaveDto) => {
    const response = await fetch(`${API_BASE_URL}/cms/templates/preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to preview template");
    }

    return response.json();
  },

  // 복제
  cloneTemplate: async (id: number, newName: string) => {
    const response = await fetch(`${API_BASE_URL}/cms/templates/${id}/clone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ newName }),
    });

    if (!response.ok) {
      throw new Error("Failed to clone template");
    }

    return response.json();
  },
};
