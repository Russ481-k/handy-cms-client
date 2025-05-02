import {
  Schedule,
  ScheduleFormData,
  ScheduleListResponse,
  ScheduleResponse,
  ScheduleListParams,
} from "@/app/cms/schedule/types";
import { privateApi, publicApi } from "./client";

export const scheduleKeys = {
  all: ["schedules"] as const,
  lists: () => [...scheduleKeys.all, "list"] as const,
  list: (filters: ScheduleListParams) =>
    [...scheduleKeys.lists(), filters] as const,
  details: () => [...scheduleKeys.all, "detail"] as const,
  detail: (id: number) => [...scheduleKeys.details(), id] as const,
};

export const scheduleApi = {
  // Get schedules for a month
  getSchedules: async (
    params: ScheduleListParams
  ): Promise<ScheduleListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.year) queryParams.append("year", params.year.toString());
    if (params.month) queryParams.append("month", params.month.toString());
    if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) queryParams.append("dateTo", params.dateTo);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.size) queryParams.append("size", params.size.toString());
    if (params.sort) queryParams.append("sort", params.sort);

    const response = await publicApi.get<ScheduleListResponse>(
      `/cms/schedule?${queryParams}`
    );
    return response;
  },

  // Get schedules by date range
  getSchedulesByRange: async (
    dateFrom: string,
    dateTo: string
  ): Promise<ScheduleListResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("dateFrom", dateFrom);
    queryParams.append("dateTo", dateTo);

    const response = await publicApi.get<ScheduleListResponse>(
      `/cms/schedule?${queryParams}`
    );
    return response;
  },

  // Get a single schedule
  getSchedule: async (id: number): Promise<ScheduleResponse> => {
    const response = await publicApi.get<ScheduleResponse>(
      `/cms/schedule/${id}`
    );
    return response;
  },

  // Create a new schedule
  createSchedule: async (data: ScheduleFormData): Promise<ScheduleResponse> => {
    const response = await privateApi.post<ScheduleResponse>(
      "/cms/schedule",
      data
    );
    return response;
  },

  // Update a schedule
  updateSchedule: async (
    id: number,
    data: Partial<ScheduleFormData>
  ): Promise<ScheduleResponse> => {
    const response = await privateApi.put<ScheduleResponse>(
      `/cms/schedule/${id}`,
      data
    );
    return response;
  },

  // Delete a schedule
  deleteSchedule: async (id: number): Promise<void> => {
    await privateApi.delete<void>(`/cms/schedule/${id}`);
  },
};
