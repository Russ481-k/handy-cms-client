export interface Template {
  templateId: number;
  templateName: string;
  templateType: string;
  layout: TemplateBlock[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export interface TemplateListResponse {
  content: Template[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
