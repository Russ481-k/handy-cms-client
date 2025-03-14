import { atom } from "recoil";

export interface User {
  uuid: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
