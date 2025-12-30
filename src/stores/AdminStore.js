import { create } from "zustand";
import { adminFetch } from "../services/httpClient";

export const useAdminStore = create((set, get) => ({
  apiKey: null,
  isAuthenticated: false,

  login: async (key) => {
    try {
      await adminFetch("admin/check").withKey(key).get();

      localStorage.setItem("admin_api_key", key);
      set({ apiKey: key, isAuthenticated: true });
      return true;
    } catch (e) {
      set({ isAuthenticated: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("admin_api_key");
    set({ apiKey: null, isAuthenticated: false });
  },

  init: async () => {
    const storedKey = localStorage.getItem("admin_api_key");
    if (!storedKey) return;
    try {
      await adminFetch("admin/check");

      set({ apiKey: storedKey, isAuthenticated: true });
    } catch {
      localStorage.removeItem("admin_api_key");
      set({ apiKey: null, isAuthenticated: false });
    }
  },
}));
