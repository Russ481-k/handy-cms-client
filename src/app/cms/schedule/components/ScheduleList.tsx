"use client";

import { useState } from "react";
import {
  Box,
  Table,
  IconButton,
  Text,
  Badge,
  VStack,
  Flex,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { Schedule, ScheduleStatus } from "../types";
import { useColors } from "@/styles/theme";
import { LuEyeOff, LuTrash2 } from "react-icons/lu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate } from "../utils";

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

const StatusBadge: React.FC<{ status: ScheduleStatus }> = ({ status }) => {
  const statusProps = {
    UPCOMING: { colorScheme: "blue", label: "예정" },
    ONGOING: { colorScheme: "green", label: "진행중" },
    ENDED: { colorScheme: "gray", label: "종료" },
    HIDDEN: { colorScheme: "red", label: "숨김" },
  }[status];

  return (
    <Badge colorScheme={statusProps.colorScheme}>{statusProps.label}</Badge>
  );
};

export function ScheduleList({
  schedules,
  onEdit,
  onDelete,
  onToggleDisplay,
}: ScheduleListProps) {
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null
  );
  const colors = useColors();

  const handleDeleteClick = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
  };

  const handleDeleteConfirm = () => {
    if (scheduleToDelete?.scheduleId) {
      onDelete(scheduleToDelete.scheduleId);
      setScheduleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setScheduleToDelete(null);
  };

  return (
    <Box>
      <Stack direction="column" gap={2}>
        {schedules.map((schedule) => (
          <Box
            key={schedule.scheduleId}
            p={3}
            borderWidth="1px"
            borderColor={colors.border}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            onClick={() => onEdit(schedule)}
          >
            <Flex justify="space-between" align="center">
              <Box flex={1}>
                <Text fontWeight="medium">{schedule.title}</Text>
                <Text fontSize="sm" color={colors.text.secondary}>
                  {formatDate(schedule.startDateTime)}
                  {" - "}
                  {formatDate(schedule.endDateTime)}
                </Text>
              </Box>
              <Stack direction="row" gap={2}>
                <IconButton
                  aria-label="Toggle display"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDisplay(schedule);
                  }}
                  color={
                    schedule.displayYn
                      ? colors.text.primary
                      : colors.text.secondary
                  }
                >
                  <LuEyeOff />
                </IconButton>
                <IconButton
                  aria-label="Delete schedule"
                  variant="ghost"
                  size="sm"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(schedule);
                  }}
                >
                  <LuTrash2 />
                </IconButton>
              </Stack>
            </Flex>
          </Box>
        ))}
      </Stack>

      <ConfirmDialog
        isOpen={!!scheduleToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="일정 삭제"
        description="선택한 일정을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
    </Box>
  );
}
