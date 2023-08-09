import { create } from 'zustand'

const useStore = create((set) => ({
    userId: "",
    username: "",
    useremail: "",
    setUserId: (id) => set((state) => ({ userId: id })),
    removeUserId: (id) => set({ userId: "" }),
}))