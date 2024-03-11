import { atom } from "recoil";

export const langState = atom({
  key: "langState",
  default: "en",
});

export const authState = atom({
  key: "userState",
  default: null,
});
