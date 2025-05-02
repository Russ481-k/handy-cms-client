"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Spinner, VStack } from "@chakra-ui/react";
import { Schedule } from "../types";
import { ListItem } from "@/components/ui/list-item";
import {
  LuFolder,
  LuFolderOpen,
  LuLink,
  LuLayoutList,
  LuFileText,
  LuEyeOff,
} from "react-icons/lu";
import { useColors } from "@/styles/theme";
import { useColorModeValue } from "@/components/ui/color-mode";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DropZone } from "@/components/ui/drop-zone";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ScheduleSkeleton } from "./ScheduleSkeleton";

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (scheduleId: number) => void;
  onToggleDisplay: (schedule: Schedule) => Promise<void>;
  onPageChange: () => void;
  onSortChange: () => void;
  currentPage: number;
  totalPages: number;
}

export function ScheduleList({
  schedules,
  onEdit,
  onDelete,
  onToggleDisplay,
  onPageChange,
  onSortChange,
  currentPage,
  totalPages,
}: ScheduleListProps) {
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null
  );
  const colors = useColors();

  const handleDeleteClick = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
  };

  const handleDeleteConfirm = () => {
    if (scheduleToDelete) {
      onDelete(scheduleToDelete.id!);
      setScheduleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setScheduleToDelete(null);
  };

  return (
    <VStack gap={4} align="stretch">
      {schedules.map((schedule) => (
        <ListItem
          key={schedule.id}
          id={schedule.id!}
          name={schedule.title}
          icon={
            <Box color={schedule.color || colors.primary.default}>
              <LuFileText />
            </Box>
          }
          isSelected={false}
          onDelete={() => handleDeleteClick(schedule)}
          renderBadges={() =>
            !schedule.displayYn && (
              <Flex align="center" justify="center" width={10} height={10}>
                <LuEyeOff size={12} color={colors.text.secondary} />
              </Flex>
            )
          }
          onClick={() => onEdit(schedule)}
        />
      ))}
      <ConfirmDialog
        isOpen={!!scheduleToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="일정 삭제"
        description="선택한 일정을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
    </VStack>
  );
}
