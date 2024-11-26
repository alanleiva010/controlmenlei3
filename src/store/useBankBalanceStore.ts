import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BankBalance } from '../types';

interface BankBalanceStore {
  bankBalances: BankBalance[];
  addBankBalance: (balance: BankBalance) => void;
  updateBankBalance: (bankId: string, currency: string, amount: number) => void;
  getBankBalance: (bankId: string, currency: string) => number;
  setBankBalance: (bankId: string, currency: string, amount: number) => void;
}

export const useBankBalanceStore = create<BankBalanceStore>()(
  persist(
    (set, get) => ({
      bankBalances: [],
      addBankBalance: (balance) =>
        set((state) => {
          const existingIndex = state.bankBalances.findIndex(
            (b) => b.bankId === balance.bankId && b.currency === balance.currency
          );

          if (existingIndex >= 0) {
            const newBalances = [...state.bankBalances];
            newBalances[existingIndex] = balance;
            return { bankBalances: newBalances };
          }

          return { bankBalances: [...state.bankBalances, balance] };
        }),
      updateBankBalance: (bankId, currency, amount) =>
        set((state) => {
          const existingIndex = state.bankBalances.findIndex(
            (b) => b.bankId === bankId && b.currency === currency
          );

          if (existingIndex >= 0) {
            const newBalances = [...state.bankBalances];
            newBalances[existingIndex] = {
              ...newBalances[existingIndex],
              amount: newBalances[existingIndex].amount + amount,
            };
            return { bankBalances: newBalances };
          }

          return {
            bankBalances: [
              ...state.bankBalances,
              { bankId, currency, amount },
            ],
          };
        }),
      setBankBalance: (bankId, currency, amount) =>
        set((state) => {
          const existingIndex = state.bankBalances.findIndex(
            (b) => b.bankId === bankId && b.currency === currency
          );

          if (existingIndex >= 0) {
            const newBalances = [...state.bankBalances];
            newBalances[existingIndex] = {
              bankId,
              currency,
              amount,
            };
            return { bankBalances: newBalances };
          }

          return {
            bankBalances: [
              ...state.bankBalances,
              { bankId, currency, amount },
            ],
          };
        }),
      getBankBalance: (bankId, currency) => {
        const balance = get().bankBalances.find(
          (b) => b.bankId === bankId && b.currency === currency
        );
        return balance?.amount || 0;
      },
    }),
    {
      name: 'bank-balance-storage',
    }
  )
);