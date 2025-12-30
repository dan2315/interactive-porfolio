import { create } from "zustand";

export const useRouteStore = create((set) => ({
  route: null,

  setRoute(route) {
    set({ route });
  }
}));
