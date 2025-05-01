import { api } from "@/lib/api-client";
import { TemplateSaveDto } from "@/types/api";

export const templateApi = {
  getTemplates: async () => {
    const response = await api.private.template.getTemplates();
    return response;
  },

  getTemplate: async (id: string) => {
    const response = await api.private.template.getTemplate(id);
    return response;
  },

  createTemplate: async (data: TemplateSaveDto) => {
    const response = await api.private.template.createTemplate(data);
    return response;
  },

  updateTemplate: async (id: string, data: TemplateSaveDto) => {
    const response = await api.private.template.updateTemplate(id, data);
    return response;
  },

  deleteTemplate: async (id: string) => {
    await api.private.template.deleteTemplate(id);
  },

  togglePublish: async (id: string, published: boolean) => {
    const response = await api.private.template.togglePublish(id, published);
    return response;
  },

  getVersions: async (id: string) => {
    const response = await api.private.template.getVersions(id);
    return response;
  },

  rollbackVersion: async (id: string, versionNo: number) => {
    const response = await api.private.template.rollbackVersion(id, versionNo);
    return response;
  },

  previewTemplate: async (data: TemplateSaveDto) => {
    const response = await api.private.template.preview(data);
    return response;
  },
};
