import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';
import { useOperatorStore } from './useOperatorStore';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email: string, password: string) => {
        const operator = useOperatorStore.getState().operators.find(
          (op) => op.email === email && op.password === password && op.active
        );
        
        if (operator) {
          set({
            user: {
              id: operator.id,
              name: operator.name,
              email: operator.email,
              role: operator.role,
              permissions: Object.entries(operator.permissions)
                .filter(([_, value]) => value)
                .map(([key]) => key),
              active: operator.active,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      version: 5,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version) => {
        if (version < 5) {
          // Reset state for all previous versions
          return { user: null };
        }
        return persistedState as AuthState;
      },
    }
  )
);