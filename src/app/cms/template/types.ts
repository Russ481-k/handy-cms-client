import { Template } from "@/app/cms/template/page";

export interface DragItem {
  id: number;
  type: string;
  parentId?: number;
  index: number;
  level: number;
}

export interface TemplateItemProps {
  template: Template;
  level: number;
  onEditTemplate: (template: Template) => void;
  expanded: boolean;
  onToggle: () => void;
  onMoveTemplate: (
    draggedId: number,
    targetId: number,
    position: "inside" | "before" | "after"
  ) => void;
  onDeleteTemplate: (templateId: number) => void;
  index: number;
  selectedTemplateId?: number;
  refreshTemplates: () => Promise<void>;
}

export interface TemplateListProps {
  templates: Template[];
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: number) => void;
  onMoveTemplate: (
    templateId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => void;
  isLoading: boolean;
  selectedTemplateId?: number;
  refreshTemplates: () => Promise<void>;
}

export interface TemplateItem {
  id: number;
  name: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  children?: TemplateItem[];
  level: number;
}
