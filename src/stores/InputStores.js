import { create } from "zustand";

export const useInputStore = create((set, get) => ({
  owner: "none",

  getOwner: () => {
      return get().owner;
  },

  claim: (owner) => {
    const current = get().owner;

    if (current === "none") {
      set({ owner });
      return true;
    }

    if (current === owner) return true;

    return false;
  },

  release: (owner) => {
    if (get().owner === owner) {
      set({ owner: "none" });
    }
  },
}));
