import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean | null;
  setAuth: (isAuthenticated: boolean) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: null,
  setAuth: (isAuthenticated) =>
    set({ isAuthenticated }),
  clearAuth: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;