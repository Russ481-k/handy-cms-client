import { api } from "@/lib/api-client";
import { TemplateSaveDto } from "@/types/api";

export const templateApi = {
  getTemplates: async () => {
    const response = await api.private.template.getTemplates();
    return response.data;
  },

  getTemplate: async (id: string) => {
    const response = await api.private.template.getTemplate(id);
    return response.data;
  },

  createTemplate: async (data: TemplateSaveDto) => {
    const response = await api.private.template.createTemplate(data);
    return response.data;
  },

  updateTemplate: async (id: string, data: TemplateSaveDto) => {
    const response = await api.private.template.updateTemplate(id, data);
    return response.data;
  },

  deleteTemplate: async (id: string) => {
    await api.private.template.deleteTemplate(id);
  },

  togglePublish: async (id: string, published: boolean) => {
    const response = await api.private.template.togglePublish(id, published);
    return response.data;
  },

  getVersions: async (id: string) => {
    const response = await api.private.template.getVersions(id);
    return response.data;
  },

  rollbackVersion: async (id: string, versionNo: number) => {
    const response = await api.private.template.rollbackVersion(id, versionNo);
    return response.data;
  },

  previewTemplate: async (data: TemplateSaveDto) => {
    const response = await api.private.template.preview(data);
    return response.data;
  },
};
