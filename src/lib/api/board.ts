import { api } from "@/lib/api-client";
import { Board } from "@/app/cms/board/types";

export const boardKeys = {
  all: ["board"] as const,
  lists: () => [...boardKeys.all, "list"] as const,
  list: (filters: string) => [...boardKeys.lists(), { filters }] as const,
  details: () => [...boardKeys.all, "detail"] as const,
  detail: (id: number) => [...boardKeys.details(), id] as const,
};

export interface BoardData {
  name: string;
  description?: string;
  type: Board["type"];
  visible: boolean;
  sortOrder: number;
}

export const boardApi = {
  getBoards: () => {
    return api.private.get<Board[]>("/cms/board");
  },

  getBoard: (id: number) => {
    return api.private.get<Board>(`/cms/board/${id}`);
  },

  saveBoard: ({ id, boardData }: { id?: number; boardData: BoardData }) => {
    if (id) {
      return api.private.put<Board>(`/cms/board/${id}`, boardData);
    }
    return api.private.post<Board>("/cms/board", boardData);
  },

  deleteBoard: (id: number) => {
    return api.private.delete(`/cms/board/${id}`);
  },
};
