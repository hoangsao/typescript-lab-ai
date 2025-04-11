import { create } from 'zustand';
import { User } from '../models/user';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) =>
    set({ user }),
}));

export default useUserStore;