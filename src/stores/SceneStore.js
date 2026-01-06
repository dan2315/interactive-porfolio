import { create } from "zustand";

export const useSceneStore = create((set) => ({
    resetTrigger: 0,
    triggerReset: () => set((state) => ({ resetTrigger: state.resetTrigger + 1 }))
}))