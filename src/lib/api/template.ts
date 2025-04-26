import { api } from "@/lib/api-client";
import { Template } from "@/app/cms/template/page";

export const templateKeys = {
  all: ["template"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (filters: string) => [...templateKeys.lists(), { filters }] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: number) => [...templateKeys.details(), id] as const,
};

export interface TemplateData {
  name: string;
  type: Template["type"];
  content: string;
  description?: string;
}

export const templateApi = {
  getTemplates: () => {
    return api.private.get<Template[]>("/cms/template");
  },

  getTemplate: (id: number) => {
    return api.private.get<Template>(`/cms/template/${id}`);
  },

  saveTemplate: ({
    id,
    templateData,
  }: {
    id?: number;
    templateData: TemplateData;
  }) => {
    if (id) {
      return api.private.put<Template>(`/cms/template/${id}`, templateData);
    }
    return api.private.post<Template>("/cms/template", templateData);
  },

  deleteTemplate: (id: number) => {
    return api.private.delete(`/cms/template/${id}`);
  },
};
