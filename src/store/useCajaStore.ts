import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyBalance, BankBalance } from '../types';
import { useBankBalanceStore } from './useBankBalanceStore';

interface CajaState {
  currentBalance: DailyBalance | null;
  history: DailyBalance[];
  openCaja: (balance: DailyBalance) => void;
  closeCaja: (userId: string) => void;
  updateBalance: (currencyCode: string, amount: number) => void;
  updateBankBalance: (bankId: string, currency: string, amount: number) => void;
}

export const useCajaStore = create<CajaState>()(
  persist(
    (set) => ({
      currentBalance: null,
      history: [],
      openCaja: (balance) => {
        // When opening the cash register, initialize bank balances
        const bankBalanceStore = useBankBalanceStore.getState();
        balance.bankBalances.forEach((bankBalance) => {
          bankBalanceStore.setBankBalance(
            bankBalance.bankId,
            bankBalance.currency,
            bankBalance.amount
          );
        });
        set({ currentBalance: balance });
      },
      closeCaja: (userId) =>
        set((state) => {
          if (!state.currentBalance) return state;

          // Get final bank balances when closing
          const bankBalanceStore = useBankBalanceStore.getState();
          const finalBankBalances = state.currentBalance.bankBalances.map((balance) => ({
            ...balance,
            amount: bankBalanceStore.getBankBalance(balance.bankId, balance.currency),
          }));

          const closedBalance = {
            ...state.currentBalance,
            bankBalances: finalBankBalances,
            closedBy: userId,
            isOpen: false,
          };

          return {
            currentBalance: null,
            history: [...state.history, closedBalance],
          };
        }),
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
      updateBankBalance: (bankId, currency, amount) => {
        const bankBalanceStore = useBankBalanceStore.getState();
        bankBalanceStore.updateBankBalance(bankId, currency, amount);
      },
    }),
    {
      name: 'caja-storage',
    }
  )
);