import { create } from 'zustand';

export const useConsoleStore = create((set) => ({
  ready: false,
  consoleApi: null,
  cartridgeId: null,
  
  registerConsole(api) {
    set({
      consoleApi: api,
      ready: true
    });
  },

  setCartridgeId: (id) => set({ cartridgeId: id }),
  
  clearConsole() {
    set({
      consoleApi: null,
      ready: false
    });
  }
}));