"use client";

import { useState } from "react";
import { VStack } from "@chakra-ui/react";
import { Template } from "../page";
import { ListItem } from "@/components/ui/list-item";
import { LuFileText, LuCode } from "react-icons/lu";
import { useColors } from "@/styles/theme";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TemplateSkeleton } from "./TemplateSkeleton";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface TemplateListProps {
  templates: Template[];
  onAddTemplate: () => void;
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: number) => void;
  isLoading: boolean;
  selectedTemplateId?: number;
  loadingTemplateId?: number | null;
}

export function TemplateList({
  templates,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate,
  isLoading,
  selectedTemplateId,
  loadingTemplateId,
}: TemplateListProps) {
  const colors = useColors();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);

  const handleDeleteClick = (templateId: number) => {
    setTemplateToDelete(templateId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      onDeleteTemplate(templateToDelete);
    }
    setIsConfirmOpen(false);
    setTemplateToDelete(null);
  };

  if (isLoading) {
    return <TemplateSkeleton />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <VStack gap={2} align="stretch">
        <ListItem
          onClick={onAddTemplate}
          icon={<LuFileText />}
          name="새 템플릿"
          isSelected={false}
          id={0}
        />
        {templates.map((template) => (
          <ListItem
            key={template.id}
            onClick={() => onEditTemplate(template)}
            icon={template.type === "PAGE" ? <LuFileText /> : <LuCode />}
            name={template.name}
            isSelected={selectedTemplateId === template.id}
            onDelete={() => handleDeleteClick(template.id)}
            id={template.id}
          />
        ))}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="템플릿 삭제"
          description="정말로 이 템플릿을 삭제하시겠습니까?"
        />
      </VStack>
    </DndProvider>
  );
}
