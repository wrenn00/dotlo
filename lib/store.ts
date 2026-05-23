import { create } from "zustand";

interface AppState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string } | null;
  setUser: (user: AppState["user"]) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
