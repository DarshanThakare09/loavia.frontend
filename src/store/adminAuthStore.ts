import { create } from 'zustand';

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()((set) => ({
  isAdminAuthenticated: false,
  login: () => set({ isAdminAuthenticated: true }),
  logout: () => set({ isAdminAuthenticated: false }),
}));
