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
  Stack,
  Flex,
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
  onDateSelect: (date: Date) => void;
  onScheduleClick: (schedule: Schedule) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  schedules,
  onDateChange,
  onDateSelect,
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
  const schedulesMap = useMemo(() => {
    const map: Record<string, Schedule[]> = {};
    schedules.forEach((schedule) => {
      const date = new Date(schedule.startDateTime);
      const dateStr = format(date, "yyyy-MM-dd");
      if (!map[dateStr]) {
        map[dateStr] = [];
      }
      map[dateStr].push(schedule);
    });
    return map;
  }, [schedules]);

  // 일정 정렬
  const sortSchedulesByTime = (schedules: Schedule[]) => {
    return [...schedules].sort((a, b) => {
      return (
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
      );
    });
  };

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
    if (!validateDate(date)) return;
    setSelectedDate(date);
    onDateSelect(date);
  };

  // 일정 클릭 핸들러
  const handleScheduleClick = (schedule: Schedule, date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
    onScheduleClick(schedule);
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <Box bg={bgColor} p={0}>
      <HStack justify="space-between" mb="-12" gap={4}>
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
          <Box
            key={day}
            textAlign="center"
            display="flex"
            alignItems="end"
            justifyContent="center"
            py={2}
            fontWeight="bold"
          >
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
          const isTodayDate = isToday(date);

          return (
            <Box
              key={dateStr}
              p={2}
              bg={isTodayDate ? "blue.50" : isSelected ? "blue.100" : undefined}
              minH="112px"
              maxH="112px"
              role="gridcell"
              aria-label={format(date, "yyyy년 M월 d일 EEEE", { locale: ko })}
              opacity={isCurrentMonth ? 1 : 0.5}
              cursor={isDisabled ? "not-allowed" : "pointer"}
              onClick={() => handleDateClick(date)}
              overflow="hidden"
              _hover={{
                bg: isDisabled
                  ? undefined
                  : isSelected
                  ? "blue.200"
                  : "gray.50",
                transform: isSelected ? "scale(1.02)" : "translateX(2px)",
                boxShadow: "sm",
                zIndex: 1,
              }}
              transition="all 0.2s ease-out"
              position="relative"
              borderWidth="1px"
              borderStyle="solid"
              borderColor={
                isSelected ? "blue.500" : isTodayDate ? "blue.300" : borderColor
              }
              boxShadow={isSelected ? "0 0 0 2px blue.500" : "none"}
            >
              <Flex direction="column" gap={1}>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={
                    isSelected
                      ? "blue.700"
                      : !isCurrentMonth
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
                <Stack direction="column" gap={1} maxH="90px" overflow="auto">
                  {sortedSchedules.slice(0, 5).map((schedule) => (
                    <Box
                      key={schedule.scheduleId}
                      p={1}
                      bg={schedule.displayYn ? "blue.50" : "gray.100"}
                      color={schedule.displayYn ? "blue.700" : "gray.500"}
                      borderRadius="sm"
                      cursor="pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleClick(schedule, date);
                      }}
                      _hover={{
                        bg: schedule.displayYn ? "blue.100" : "gray.200",
                      }}
                    >
                      <Text fontSize="xs" truncate>
                        {format(new Date(schedule.startDateTime), "HH:mm")}{" "}
                        {schedule.title}
                      </Text>
                    </Box>
                  ))}
                  {sortedSchedules.length > 5 && (
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      textAlign="right"
                      cursor="pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(date);
                      }}
                      _hover={{ textDecoration: "underline" }}
                    >
                      +{sortedSchedules.length - 5}개 더보기
                    </Text>
                  )}
                </Stack>
              </Flex>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};
