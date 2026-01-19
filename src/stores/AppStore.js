import { create } from "zustand";

export const useAppStore = create((set) => {
  const firstVisit = !localStorage.getItem("visited");
  if (firstVisit) localStorage.setItem("visited", "true");

  return {
    isFirstVisit: firstVisit
  };
});
