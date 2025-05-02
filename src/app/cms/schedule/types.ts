import { Menu } from "@/types/api";

export interface DragItem {
  id: number;
  type: string;
  parentId?: number;
  index: number;
  level: number;
}

export interface MenuItemProps {
  menu: Menu;
  level: number;
  onEditMenu: (menu: Menu) => void;
  expanded: boolean;
  onToggle: () => void;
  onMoveMenu: (
    draggedId: number,
    targetId: number,
    position: "inside" | "before" | "after"
  ) => void;
  onDeleteMenu: (menuId: number) => void;
  index: number;
  selectedMenuId?: number;
  refreshMenus: () => Promise<void>;
}

export interface MenuListProps {
  menus: Menu[];
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (menuId: number) => void;
  onMoveMenu: (
    menuId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => void;
  isLoading: boolean;
  selectedMenuId?: number;
  refreshMenus: () => Promise<void>;
}

export interface MenuItem {
  id: number;
  name: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  children?: MenuItem[];
  level: number;
}

export type ScheduleStatus = "UPCOMING" | "ONGOING" | "ENDED" | "HIDDEN";

export interface Manager {
  name: string;
  tel: string;
}

export interface ScheduleExtra {
  manager?: Manager;
  fee?: number;
  category?: string;
  [key: string]: any;
}

export interface Schedule {
  id?: number;
  title: string;
  descriptionHtml?: string;
  startTime: string;
  endTime: string;
  place?: string;
  displayYn: boolean;
  color?: string;
  extra?: ScheduleExtra;
  status?: ScheduleStatus;

  // Audit fields
  createdBy?: string;
  createdIp?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedIp?: string;
  updatedAt?: string;
}

export interface ScheduleFormData {
  title: string;
  descriptionHtml: string;
  startTime: string;
  endTime: string;
  place: string;
  displayYn: boolean;
  color?: string;
  extra?: {
    manager?: {
      name: string;
      tel: string;
    };
    fee?: number;
    category?: string;
  };
}

export interface PaginationResponse {
  page: number;
  size: number;
  total: number;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  pagination?: PaginationResponse;
}

export interface ScheduleListParams {
  year?: number;
  month?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const DEFAULT_SCHEDULE_COLOR = {
  default: "#E2E8F0", // gray.200
  important: "#3182CE", // blue.500
};

export interface ScheduleListResponse {
  status: number;
  data: Schedule[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

export interface ScheduleResponse {
  status: number;
  data: Schedule;
}

export interface ErrorResponse {
  status: number;
  error: {
    code: string;
    message: string;
  };
}
