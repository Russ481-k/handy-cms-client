import { Schedule, ScheduleStatus } from "./types";
import { format, isAfter, isBefore, isWithinInterval } from "date-fns";

export const calculateScheduleStatus = (schedule: Schedule): ScheduleStatus => {
  const now = new Date();
  const startTime = new Date(schedule.startTime);
  const endTime = new Date(schedule.endTime);

  if (!schedule.displayYn) return "HIDDEN";
  if (isBefore(now, startTime)) return "UPCOMING";
  if (isWithinInterval(now, { start: startTime, end: endTime }))
    return "ONGOING";
  return "ENDED";
};

export const formatDateTime = (date: string) => {
  return format(new Date(date), "yyyy-MM-dd HH:mm");
};

export const getStatusColor = (status: ScheduleStatus): string => {
  switch (status) {
    case "UPCOMING":
      return "blue.500";
    case "ONGOING":
      return "green.500";
    case "ENDED":
      return "gray.500";
    case "HIDDEN":
      return "red.500";
    default:
      return "gray.500";
  }
};

export const getStatusText = (status: ScheduleStatus): string => {
  switch (status) {
    case "UPCOMING":
      return "예정";
    case "ONGOING":
      return "진행중";
    case "ENDED":
      return "종료";
    case "HIDDEN":
      return "숨김";
    default:
      return "";
  }
};

export const groupSchedulesByDate = (schedules: Schedule[]) => {
  return schedules.reduce((acc, schedule) => {
    const date = format(new Date(schedule.startTime), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);
};

export const sortSchedulesByTime = (schedules: Schedule[]) => {
  return [...schedules].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
};
