import { atom } from "recoil";
import { User } from "@/types/api";

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
