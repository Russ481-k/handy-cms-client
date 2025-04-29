"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Spinner, VStack } from "@chakra-ui/react";
import { Template } from "@/types/api";
import { ListItem } from "@/components/ui/list-item";
import {
  LuFolder,
  LuFolderOpen,
  LuLink,
  LuLayoutList,
  LuFileText,
} from "react-icons/lu";
import { useColors } from "@/styles/theme";
import { useColorModeValue } from "@/components/ui/color-mode";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {} from "@/components/ui/drop-zone";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TemplateSkeleton } from "./TemplateSkeleton";

interface TemplateListProps {
  templates: Template[];
  onAddTemplate: (template: Template) => void;
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: number) => void;
  isLoading: boolean;
  selectedTemplateId?: number;
  loadingTemplateId?: number | null;
  forceExpandTemplateId?: number | null;
}

export function TemplateList({
  templates,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate,
  isLoading,
  selectedTemplateId,
  loadingTemplateId,
  forceExpandTemplateId,
}: TemplateListProps) {
  const [expandedTemplates, setExpandedTemplates] = useState<Set<number>>(
    new Set([-1])
  );
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null
  );
  const templateListRef = useRef<HTMLDivElement>(null);
  const colors = useColors();
  const iconColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );
  const folderColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

  const toggleTemplate = (templateId: number) => {
    if (templateId === -1) return;

    setExpandedTemplates((prev) => {
      const next = new Set(prev);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    });
  };

  const getTemplateIcon = (template: Template) => {
    const color = iconColor;

    switch (template.type) {
      case "MAIN":
        return (
          <Box color={color}>
            <LuLayoutList />
          </Box>
        );
      case "SUB":
        return (
          <Box color={color}>
            <LuFileText />
          </Box>
        );
      default:
        return (
          <Box color={color}>
            <LuFileText />
          </Box>
        );
    }
  };

  const handleAddTemplate = (parentTemplate: Template) => {
    console.log(
      "TemplateList handleAddTemplate called with parentTemplate:",
      parentTemplate
    );

    // 전체 메뉴인 경우 (id가 -1)
    if (parentTemplate.id === -1) {
      // 전체 메뉴를 부모로 사용
      onAddTemplate(parentTemplate);
      return;
    }

    // 부모 메뉴가 접혀있으면 펼치기
    if (!expandedTemplates.has(parentTemplate.id)) {
      console.log("Expanding parent template:", parentTemplate.id);
      toggleTemplate(parentTemplate.id);
    }

    // 부모 컴포넌트의 handleAddTemplate 함수 호출
    onAddTemplate(parentTemplate);
  };

  const handleDeleteClick = (template: Template) => {
    setTemplateToDelete(template);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      onDeleteTemplate(templateToDelete.id);
      setTemplateToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setTemplateToDelete(null);
  };

  // 선택된 메뉴로 스크롤 이동
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

  // forceExpandTemplateId가 변경될 때 해당 메뉴를 강제로 펼치고 포커스
  useEffect(() => {
    if (forceExpandTemplateId) {
      console.log("Force expanding template:", forceExpandTemplateId);
      setExpandedTemplates((prev) => {
        const next = new Set(prev);
        next.add(forceExpandTemplateId);
        return next;
      });

      // 약간의 지연을 두어 DOM이 업데이트된 후에 포커스
      setTimeout(() => {
        const element = templateListRef.current?.querySelector(
          `[data-template-id="${forceExpandTemplateId}"]`
        );
        console.log("Scrolling to element:", element);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [forceExpandTemplateId]);

  const renderTemplateItem = (
    template: Template,
    level: number,
    index: number
  ) => {
    const isLoading = loadingTemplateId === template.id;

    return (
      <div key={template.id} data-template-id={template.id}>
        <Box cursor="pointer">
          <ListItem
            id={template.id}
            name={template.templateName || template.name}
            icon={isLoading ? <Spinner size="sm" /> : getTemplateIcon(template)}
            isSelected={template.id === selectedTemplateId}
            onDelete={() => handleDeleteClick(template)}
            renderBadges={() => !template.published && "비공개"}
            onClick={() => onEditTemplate(template)}
            index={index}
            level={level}
            type={template.type}
          />
        </Box>
      </div>
    );
  };

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
    <Box ref={templateListRef}>
      <VStack gap={1} align="stretch">
        {templates.map((template, index) =>
          renderTemplateItem(template, 0, index)
        )}
      </VStack>
      <ConfirmDialog
        isOpen={!!templateToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="템플릿 삭제"
        description={`"${templateToDelete?.templateName}" 템플릿을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        backdrop="rgba(0, 0, 0, 0.5)"
      />
    </Box>
  );
}
