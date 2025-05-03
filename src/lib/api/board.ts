import { Board, BoardData, Post, BoardMasterApiResponse } from "@/types/api";
import { privateApi } from "./client";

export const boardKeys = {
  all: ["board"] as const,
  lists: () => [...boardKeys.all, "list"] as const,
  list: (filters: string) => [...boardKeys.lists(), { filters }] as const,
  details: () => [...boardKeys.all, "detail"] as const,
  detail: (id: number) => [...boardKeys.details(), id] as const,
  posts: (boardId: number) => [...boardKeys.details(), boardId, "posts"] as const,
} as const;

export const boardApi = {
  // Board Master APIs
  getBoardMasters: () => {
    return privateApi.get<BoardMasterApiResponse>("/cms/bbs/master");
  },

  getBoards: () => {
    return privateApi.get<Board[]>("/cms/bbs/master");
  },

  getBoard: (id: number) => {
    return privateApi.get<Board>(`/cms/bbs/master/${id}`);
  },

  saveBoard: ({ id, boardData }: { id?: number; boardData: BoardData }) => {
    if (id) {
      return privateApi.put<Board>(`/cms/bbs/master/${id}`, boardData);
    }
    return privateApi.post<Board>("/cms/bbs/master", boardData);
  },

  deleteBoard: (id: number) => {
    return privateApi.delete(`/cms/bbs/master/${id}`);
  },

  // Post APIs
  getPosts: (
    bbsId: number,
    params?: {
      page?: number;
      size?: number;
      search?: string;
      category?: string;
      sort?: string;
    }
  ) => {
    const queryString = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryString.append(key, value.toString());
        }
      });
    }
    return privateApi.get<{
      content: Post[];
      pageable: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
      };
    }>(`/cms/bbs/${bbsId}?${queryString.toString()}`);
  },

  getPost: (bbsId: number, nttId: number) => {
    return privateApi.get<Post>(`/cms/bbs/${bbsId}/${nttId}`);
  },

  createPost: (postData: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    return privateApi.post<Post>("/bbs", postData);
  },

  updatePost: (bbsId: number, nttId: number, postData: Partial<Post>) => {
    return privateApi.put<Post>(`/cms/bbs/${bbsId}/${nttId}`, postData);
  },

  deletePost: (bbsId: number, nttId: number) => {
    return privateApi.delete(`/cms/bbs/${bbsId}/${nttId}`);
  },

  // QNA APIs
  createQuestion: (
    bbsId: number,
    questionData: { title: string; contentHtml: string; writer?: string }
  ) => {
    return privateApi.post<Post>(`/cms/bbs/${bbsId}/question`, questionData);
  },

  createReply: (replyData: {
    parentNttId: number;
    bbsId: number;
    title: string;
    contentHtml: string;
    writer: string;
  }) => {
    return privateApi.post<Post>("/cms/bbs/reply", replyData);
  },
};
