// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,
      isInitialized: false,
      
      setUser: (user, token) => set({ 
        user, 
        token: token || null,
        isLoading: false,
        isInitialized: true
      }),
      
      logout: () => set({ 
        user: null, 
        token: null,
        isLoading: false,
        isInitialized: true
      }),

      setLoading: (loading) => set({ isLoading: loading }),
      
      initialize: () => set({ isLoading: false, isInitialized: true })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);