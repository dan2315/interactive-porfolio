import { create } from "zustand";

export const useSceneStore = create((set) => ({
    resetTrigger: 0,
    collisionReady: false,
    setCollisionReady: () => set((state) => ({ collisionReady: true })),
    triggerReset: () => set((state) => ({ resetTrigger: state.resetTrigger + 1 }))
}))