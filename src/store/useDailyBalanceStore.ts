import { create } from 'zustand';
import { DailyBalance } from '../types';

interface DailyBalanceState {
  currentBalance: DailyBalance | null;
  openDaily: (balance: DailyBalance) => void;
  closeDaily: (userId: string) => void;
  updateBalance: (currencyCode: string, amount: number) => void;
}

export const useDailyBalanceStore = create<DailyBalanceState>((set) => ({
  currentBalance: null,
  openDaily: (balance) => set({ currentBalance: balance }),
  closeDaily: (userId) =>
    set((state) => ({
      currentBalance: state.currentBalance
        ? { ...state.currentBalance, isOpen: false, closedBy: userId }
        : null,
    })),
  updateBalance: (currencyCode, amount) =>
    set((state) => {
      if (!state.currentBalance) return state;
      return {
        currentBalance: {
          ...state.currentBalance,
          currencies: {
            ...state.currentBalance.currencies,
            [currencyCode]: {
              ...state.currentBalance.currencies[currencyCode],
              currentAmount:
                state.currentBalance.currencies[currencyCode].currentAmount +
                amount,
            },
          },
        },
      };
    }),
}));