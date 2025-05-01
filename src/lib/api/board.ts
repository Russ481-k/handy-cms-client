import { api } from "@/lib/api-client";
import { Board, BoardData, Post } from "@/types/api";

export const boardKeys = {
  all: ["board"] as const,
  lists: () => [...boardKeys.all, "list"] as const,
  list: (filters: string) => [...boardKeys.lists(), { filters }] as const,
  details: () => [...boardKeys.all, "detail"] as const,
  detail: (id: number) => [...boardKeys.details(), id] as const,
};

export const boardApi = {
  getBoards: () => {
    return api.private.get<Board[]>("/cms/bbs/master");
  },

  getBoard: (id: number) => {
    return api.private.get<Board>(`/cms/bbs/master/${id}`);
  },

  saveBoard: ({ id, boardData }: { id?: number; boardData: BoardData }) => {
    if (id) {
      return api.private.put<Board>(`/cms/bbs/master/${id}`, boardData);
    }
    return api.private.post<Board>("/cms/bbs/master", boardData);
  },

  deleteBoard: (id: number) => {
    return api.private.delete(`/cms/bbs/master/${id}`);
  },

  // 게시글 관련 API
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
    return api.private.get<{
      content: Post[];
      pageable: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
      };
    }>(`/cms/bbs/${bbsId}?${queryString.toString()}`);
  },

  getPost: (bbsId: number, nttId: number) => {
    return api.private.get<Post>(`/cms/bbs/${bbsId}/${nttId}`);
  },

  createPost: (postData: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    return api.private.post<Post>("/bbs", postData);
  },

  updatePost: (bbsId: number, nttId: number, postData: Partial<Post>) => {
    return api.private.put<Post>(`/cms/bbs/${bbsId}/${nttId}`, postData);
  },

  deletePost: (bbsId: number, nttId: number) => {
    return api.private.delete(`/cms/bbs/${bbsId}/${nttId}`);
  },

  // QNA 관련 API
  createQuestion: (
    bbsId: number,
    questionData: { title: string; contentHtml: string; writer?: string }
  ) => {
    return api.private.post<Post>(`/cms/bbs/${bbsId}/question`, questionData);
  },

  createReply: (replyData: {
    parentNttId: number;
    bbsId: number;
    title: string;
    contentHtml: string;
    writer: string;
  }) => {
    return api.private.post<Post>("/cms/bbs/reply", replyData);
  },
};
