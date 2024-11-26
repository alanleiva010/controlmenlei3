import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Operator } from '../types';

interface OperatorStore {
  operators: Operator[];
  addOperator: (operator: Omit<Operator, 'id' | 'active'>) => void;
  updateOperator: (id: string, operator: Partial<Operator>) => void;
  deleteOperator: (id: string) => void;
  getOperatorByEmail: (email: string) => Operator | undefined;
}

const defaultOperators: Operator[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'alan@menlei.net',
    password: '123456',
    role: 'admin',
    permissions: {
      clients: true,
      providers: true,
      banks: true,
      cryptos: true,
      currencies: true,
      operators: true,
      transactions: true,
      reports: true,
    },
    active: true,
  }
];

export const useOperatorStore = create<OperatorStore>()(
  persist(
    (set, get) => ({
      operators: defaultOperators,
      addOperator: (operator) =>
        set((state) => ({
          operators: [
            ...state.operators,
            { ...operator, id: Math.random().toString(36).substr(2, 9), active: true },
          ],
        })),
      updateOperator: (id, operator) =>
        set((state) => ({
          operators: state.operators.map((op) =>
            op.id === id ? { ...op, ...operator } : op
          ),
        })),
      deleteOperator: (id) =>
        set((state) => ({
          operators: state.operators.filter((op) => op.id !== id),
        })),
      getOperatorByEmail: (email) => {
        return get().operators.find((op) => op.email === email);
      },
    }),
    {
      name: 'operator-storage',
      version: 5,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version) => {
        if (version < 5) {
          // Reset to default state for all previous versions
          return { operators: defaultOperators };
        }
        return persistedState as OperatorStore;
      },
    }
  )
);