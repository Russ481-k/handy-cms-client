"use client";

import { Box, Button, HStack, Icon, Text, IconButton } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { Template } from "@/types/template";
import { FaGripVertical } from "react-icons/fa";
import { useColors } from "@/styles/theme";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface TemplateItemProps {
  template: Template;
  isSelected: boolean;
  onSelect: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
}

export function TemplateItem({
  template,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: TemplateItemProps) {
  const colors = useColors();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "template",
    item: { id: template.templateId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag}
      p={4}
      bg={colors.bg}
      borderBottom="1px"
      cursor="move"
      opacity={isDragging ? 0.5 : 1}
      onClick={() => onSelect(template)}
    >
      <HStack justify="space-between">
        <HStack gap={4}>
          <Icon as={FaGripVertical} color="gray.400" />
          <Text fontWeight="medium">{template.templateName}</Text>
        </HStack>
        <HStack gap={2}>
          <IconButton
            aria-label="Edit template"
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(template);
            }}
          >
            <FiEdit2 />
          </IconButton>
          <IconButton
            aria-label="Delete template"
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(template);
            }}
          >
            <FiTrash2 />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}
