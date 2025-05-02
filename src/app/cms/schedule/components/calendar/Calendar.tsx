import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  getWeek,
  isLeapYear,
  isValid,
  parseISO,
  differenceInDays,
  addDays,
  subDays,
  getDaysInMonth,
  getDay,
  setDate,
  getDate,
  getMonth,
  getYear,
  setMonth,
  setYear,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Schedule } from "../../types";
import { groupSchedulesByDate, sortSchedulesByTime } from "../../utils";
import { useColors } from "@/styles/theme";
import { toaster } from "@/components/ui/toaster";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@/components/ui/popover";

interface CalendarProps {
  currentDate: Date;
  schedules: Schedule[];
  onDateChange: (date: Date) => void;
  onScheduleClick: (schedule: Schedule) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  schedules,
  onDateChange,
  onScheduleClick,
  minDate,
  maxDate,
}) => {
  const colors = useColors();
  const bgColor = colors.bg;
  const borderColor = colors.border;
  const todayBgColor = colors.bg;
  const scheduleBgColor = colors.primary.default;
  const scheduleTextColor = colors.text.primary;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 날짜 유효성 검사
  const validateDate = (date: Date): boolean => {
    if (!isValid(date)) return false;
    if (minDate && differenceInDays(date, minDate) < 0) return false;
    if (maxDate && differenceInDays(date, maxDate) > 0) return false;
    return true;
  };

  // 현재 달의 시작일과 마지막일 계산
  const startDate = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const endDate = useMemo(() => endOfMonth(currentDate), [currentDate]);

  // 달력에 표시할 모든 날짜 계산
  const days = useMemo(() => {
    const firstDayOfMonth = getDay(startDate);
    const daysInMonth = getDaysInMonth(currentDate);

    const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) =>
      subDays(startDate, firstDayOfMonth - i)
    );

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) =>
      setDate(currentDate, i + 1)
    );

    // 5줄로 제한 (7일 * 5줄 = 35일)
    const totalDays = 35;
    const nextMonthDays = Array.from(
      { length: totalDays - (prevMonthDays.length + currentMonthDays.length) },
      (_, i) => addDays(endDate, i + 1)
    );

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [currentDate, startDate, endDate]);

  // 일정 그룹화
  const schedulesMap = useMemo(
    () => groupSchedulesByDate(schedules),
    [schedules]
  );

  // 이전 달로 이동
  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    if (validateDate(newDate)) {
      onDateChange(newDate);
      setSelectedDate(null);
    } else {
      toaster.error({
        title: "이전 달로 이동할 수 없습니다.",
        duration: 3000,
      });
    }
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    if (validateDate(newDate)) {
      onDateChange(newDate);
      setSelectedDate(null);
    } else {
      toaster.error({
        title: "다음 달로 이동할 수 없습니다.",
        duration: 3000,
      });
    }
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    if (validateDate(date)) {
      setSelectedDate(date);
      onDateChange(date);
    }
  };

  // 일정 클릭 핸들러
  const handleScheduleClick = (schedule: Schedule) => {
    try {
      onScheduleClick(schedule);
    } catch (error) {
      console.error("Error handling schedule click:", error);
      toaster.error({
        title: "일정 클릭 처리 중 오류가 발생했습니다.",
        duration: 3000,
      });
    }
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const renderScheduleButton = (schedule: Schedule) => (
    <Button
      key={schedule.id}
      size="xs"
      bg={schedule.color || scheduleBgColor}
      color={scheduleTextColor}
      onClick={() => handleScheduleClick(schedule)}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      width="100%"
      justifyContent="flex-start"
      fontWeight="normal"
      role="button"
      aria-label={`${schedule.title} - ${format(
        new Date(schedule.startTime),
        "HH:mm"
      )}`}
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "sm",
      }}
      transition="all 0.2s"
    >
      {format(new Date(schedule.startTime), "HH:mm")} {schedule.title}
    </Button>
  );

  return (
    <Box bg={bgColor} p={0}>
      <HStack justify="space-between" mb={4} gap={4}>
        <IconButton
          aria-label="이전 달로 이동"
          onClick={handlePrevMonth}
          variant="ghost"
          disabled={minDate && differenceInDays(startDate, minDate) <= 0}
        >
          <FiArrowLeft />
        </IconButton>
        <Text fontSize="xl" fontWeight="bold" role="heading" aria-level={1}>
          {format(currentDate, "yyyy년 M월", { locale: ko })}
          {isLeapYear(currentDate) && " (윤년)"}
        </Text>
        <IconButton
          aria-label="다음 달로 이동"
          onClick={handleNextMonth}
          variant="ghost"
          disabled={maxDate && differenceInDays(endDate, maxDate) >= 0}
        >
          <FiArrowRight />
        </IconButton>
      </HStack>

      <Grid
        templateColumns="repeat(7, 1fr)"
        gap={0}
        templateRows="repeat(6, 1fr)"
      >
        {weekDays.map((day) => (
          <Box key={day} textAlign="center" py={2} fontWeight="bold">
            <Text
              color={
                day === "일"
                  ? "red.500"
                  : day === "토"
                  ? "blue.500"
                  : colors.text.primary
              }
            >
              {day}
            </Text>
          </Box>
        ))}

        {days.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const daySchedules = schedulesMap[dateStr] || [];
          const sortedSchedules = sortSchedulesByTime(daySchedules);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isDisabled = !validateDate(date);
          const dayOfWeek = format(date, "E");
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          const dayCell = (
            <Box
              key={dateStr}
              borderColor={borderColor}
              p={2}
              bg={
                isToday(date)
                  ? todayBgColor
                  : isSelected
                  ? "gray.100"
                  : undefined
              }
              minH="102px"
              maxH="102px"
              role="gridcell"
              aria-label={format(date, "yyyy년 M월 d일 EEEE", { locale: ko })}
              opacity={isCurrentMonth ? 1 : 0.5}
              cursor={isDisabled ? "not-allowed" : "pointer"}
              onClick={() => !isDisabled && handleDateClick(date)}
              overflow="hidden"
              _hover={{
                bg: isDisabled ? undefined : "gray.50",
                transform: "scale(1.02)",
                boxShadow: "sm",
                zIndex: 1,
              }}
              transition="all 0.2s"
              position="relative"
              borderWidth="1px"
              borderStyle="solid"
            >
              <Text
                fontSize="sm"
                color={
                  !isCurrentMonth
                    ? colors.text.muted
                    : dayOfWeek === "일"
                    ? "red.500"
                    : dayOfWeek === "토"
                    ? "blue.500"
                    : colors.text.primary
                }
              >
                {format(date, "d")}
              </Text>
              <VStack
                align="stretch"
                mt={1}
                gap={1}
                maxH="90px"
                overflow="auto"
              >
                {sortedSchedules.slice(0, 5).map(renderScheduleButton)}
                {sortedSchedules.length > 5 && (
                  <PopoverRoot>
                    <PopoverTrigger>
                      <Text
                        fontSize="xs"
                        color={colors.text.secondary}
                        textAlign="right"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                      >
                        +{sortedSchedules.length - 5}개 더보기
                      </Text>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent width="300px">
                        <PopoverBody>
                          <VStack align="stretch" gap={1}>
                            {sortedSchedules.slice(5).map(renderScheduleButton)}
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  </PopoverRoot>
                )}
              </VStack>
            </Box>
          );

          return dayCell;
        })}
      </Grid>
    </Box>
  );
};
