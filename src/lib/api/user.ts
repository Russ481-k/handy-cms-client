import { api } from "../api-client";
import { User, UserData } from "@/types/api";

export const createUser = async (userData: UserData): Promise<User> => {
  const response = await api.private.post<User>("/cms/users", {
    ...userData,
    organizationId: "handy", // 기본 조직 ID
    groupId: "1", // 기본 그룹 ID
  });
  return response.data;
};
