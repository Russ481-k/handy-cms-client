"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Spinner, VStack } from "@chakra-ui/react";
import { Template } from "@/types/template";
import { ListItem } from "@/components/ui/list-item";
import { useColors } from "@/styles/theme";
import { useColorModeValue } from "@/components/ui/color-mode";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DropZone } from "@/components/ui/drop-zone";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TemplateSkeleton } from "./TemplateSkeleton";

interface TemplateListProps {
  templates: Template[];
  onAdd: (
    templateData: Omit<Template, "templateId" | "createdAt" | "updatedAt">
  ) => void;
  onEdit: (
    id: number,
    templateData: Omit<Template, "templateId" | "createdAt" | "updatedAt">
  ) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, published: boolean) => void;
  isLoading: boolean;
  selectedTemplateId?: number;
  loadingTemplateId?: number | null;
}

export function TemplateList({
  templates,
  onAdd,
  onEdit,
  onDelete,
  onTogglePublish,
  isLoading,
  selectedTemplateId,
  loadingTemplateId,
}: TemplateListProps) {
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null
  );
  const templateListRef = useRef<HTMLDivElement>(null);
  const colors = useColors();
  const iconColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );

  const [{ isDragging }, drag] = useDrag({
    type: "LIST_ITEM",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDelete = (template: Template) => {
    setTemplateToDelete(template);
  };

  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      try {
        await onDelete(templateToDelete.templateId);
      } catch (error) {
        console.error("Failed to delete template:", error);
      }
    }
    setTemplateToDelete(null);
  };

  const handleDeleteCancel = () => {
    setTemplateToDelete(null);
  };

  // 선택된 템플릿으로 스크롤 이동
  useEffect(() => {
    if (selectedTemplateId && templateListRef.current) {
      const selectedElement = templateListRef.current.querySelector(
        `[data-template-id="${selectedTemplateId}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedTemplateId]);

  if (isLoading) {
    return <TemplateSkeleton />;
  }

  if (templates.length === 0) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Text color="gray.500">템플릿이 없습니다.</Text>
      </Flex>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        ref={(node: HTMLDivElement | null) => {
          if (node) {
            drag(node);
            templateListRef.current = node;
          }
        }}
      >
        <VStack gap={0} align="stretch">
          {templates.map((template) => (
            <div
              key={template.templateId}
              data-template-id={template.templateId}
            >
              <Box cursor="pointer">
                <ListItem
                  id={template.templateId}
                  name={template.templateName}
                  icon={
                    loadingTemplateId === template.templateId ? (
                      <Spinner size="sm" />
                    ) : (
                      <></>
                    )
                  }
                  isSelected={template.templateId === selectedTemplateId}
                  onDelete={() => handleDelete(template)}
                  renderBadges={() => !template.published && "비공개"}
                  onClick={() => onEdit(template.templateId, template)}
                  type={
                    template.templateType as
                      | "LINK"
                      | "FOLDER"
                      | "BOARD"
                      | "CONTENT"
                  }
                />
              </Box>
            </div>
          ))}
        </VStack>
      </Box>
      <ConfirmDialog
        isOpen={!!templateToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleConfirmDelete}
        title="템플릿 삭제"
        description={`"${templateToDelete?.templateName}" 템플릿을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        backdrop="rgba(0, 0, 0, 0.5)"
      />
    </DndProvider>
  );
}
