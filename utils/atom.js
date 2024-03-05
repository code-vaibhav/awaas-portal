import { atom } from "recoil";

export const langState = atom({
  key: "langState", // unique ID (with respect to other atoms/selectors)
  default: "en", // default value (aka initial value)
});
