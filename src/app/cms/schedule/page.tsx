"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Heading, Badge } from "@chakra-ui/react";
import { ScheduleList } from "./components/admin/ScheduleList";
import { ScheduleForm } from "./components/admin/ScheduleForm";
import { GridSection } from "@/components/ui/grid-section";
import { useColors } from "@/styles/theme";
import { toaster, Toaster } from "@/components/ui/toaster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Calendar } from "./components/calendar/Calendar";
import {
  Schedule,
  ScheduleListParams,
  ScheduleListResponse,
  ScheduleFormData,
  ScheduleResponse,
} from "./types";
import { scheduleApi } from "@/lib/api/schedule";

export default function ScheduleManagementPage() {
  const queryClient = useQueryClient();
  const colors = useColors();

  // State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  // Queries
  const { data: schedulesResponse, isLoading: isSchedulesLoading } =
    useQuery<ScheduleListResponse>({
      queryKey: [
        "schedules",
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
      ],
      queryFn: () =>
        scheduleApi.getSchedules({
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          page: 1,
          size: 100,
        }),
    });

  // Mutations
  const createScheduleMutation = useMutation({
    mutationFn: (data: ScheduleFormData) => scheduleApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toaster.create({
        title: "일정이 생성되었습니다.",
        type: "success",
      });
      setSelectedSchedule(null);
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: (data: { id: number; schedule: Partial<ScheduleFormData> }) =>
      scheduleApi.updateSchedule(data.id, data.schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toaster.create({
        title: "일정이 수정되었습니다.",
        type: "success",
      });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: scheduleApi.deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toaster.create({
        title: "일정이 삭제되었습니다.",
        type: "success",
      });
      setSelectedSchedule(null);
    },
  });

  const toggleDisplayMutation = useMutation({
    mutationFn: (schedule: Schedule) =>
      scheduleApi.updateSchedule(schedule.id!, {
        ...schedule,
        displayYn: !schedule.displayYn,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toaster.create({
        title: "일정 표시 상태가 변경되었습니다.",
        type: "success",
      });
    },
  });

  // Handlers
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    setScheduleToDelete(scheduleId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (scheduleToDelete) {
      await deleteScheduleMutation.mutateAsync(scheduleToDelete);
      setIsDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  const handleToggleDisplay = async (schedule: Schedule) => {
    await toggleDisplayMutation.mutateAsync(schedule);
  };

  const handleSubmit = async (data: ScheduleFormData) => {
    if (selectedSchedule?.id) {
      await updateScheduleMutation.mutateAsync({
        id: selectedSchedule.id,
        schedule: data,
      });
    } else {
      await createScheduleMutation.mutateAsync(data);
    }
  };

  // Layout configuration
  const scheduleLayout = [
    {
      id: "header",
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      isStatic: true,
      isHeader: true,
    },
    {
      id: "calendar",
      x: 0,
      y: 1,
      w: 9,
      h: 6,
      title: "캘린더",
      subtitle: "월간 일정을 확인할 수 있습니다.",
    },
    {
      id: "scheduleList",
      x: 9,
      y: 1,
      w: 3,
      h: 6,
      title: "일정 목록",
      subtitle: "전체 일정을 관리할 수 있습니다.",
    },
    {
      id: "scheduleForm",
      x: 0,
      y: 7,
      w: 12,
      h: 5,
      title: "일정 편집",
      subtitle: "일정을 등록하거나 수정할 수 있습니다.",
    },
  ];

  return (
    <Box bg={colors.bg} minH="100vh" w="full" position="relative">
      <Box w="full">
        <GridSection initialLayout={scheduleLayout}>
          <Flex justify="space-between" align="center" h="36px">
            <Flex align="center" gap={2} px={2}>
              <Heading
                size="lg"
                color={colors.text.primary}
                letterSpacing="tight"
              >
                일정 관리
              </Heading>
              <Badge
                bg={colors.secondary.light}
                color={colors.secondary.default}
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="bold"
              >
                관리자
              </Badge>
            </Flex>
          </Flex>

          <Box>
            <Calendar
              currentDate={currentDate}
              schedules={schedulesResponse?.data || []}
              onDateChange={handleDateChange}
              onScheduleClick={handleScheduleClick}
            />
          </Box>

          <Box>
            <ScheduleList
              schedules={schedulesResponse?.data || []}
              onEdit={handleEditSchedule}
              onDelete={handleDeleteSchedule}
              onToggleDisplay={handleToggleDisplay}
              onPageChange={() => {}}
              onSortChange={() => {}}
              currentPage={1}
              totalPages={1}
            />
          </Box>

          <Box>
            {(selectedSchedule || !schedulesResponse?.data?.length) && (
              <ScheduleForm
                schedule={selectedSchedule || undefined}
                onSubmit={handleSubmit}
                onCancel={() => setSelectedSchedule(null)}
              />
            )}
          </Box>
        </GridSection>
      </Box>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="일정 삭제"
        description="선택한 일정을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        backdrop="rgba(0, 0, 0, 0.5)"
      />
      <Toaster />
    </Box>
  );
}
