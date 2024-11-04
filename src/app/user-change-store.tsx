import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserChangeStore = create<UserStore>()(persist((set) => ({
    users: [],
    addChange: (change: UserChange) => set(state => ({ users: [...state.users, change] })),
    removeChange: (change: UserChange) => set(state => ({ users: state.users.filter(x => x.id != change.id) }))
}), { name: 'current-user' }));

export interface UserStore {
    users: UserChange[];
    addChange: (change: UserChange) => void;
    removeChange: (change: UserChange) => void;
}

export interface UserChange {
    id: string;
    active: boolean;
}
