import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create<UserStore>()(persist((set) => ({
    user: undefined,
    setUser: (user: User) => set({ user }),
    clearUser: () => set({ user: undefined }),
}), { name: 'current-user' }));

export interface UserStore {
    user: User | undefined;
    setUser: (user: User) => void;
    clearUser: () => void
}

export interface User {
    id: string;
    username: string;
    active: boolean;
}