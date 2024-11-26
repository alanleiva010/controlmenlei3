import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '../types';
import { useCajaStore } from './useCajaStore';

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  getTransactionsByDate: (startDate: Date, endDate: Date) => Transaction[];
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
        };

        const updateCajaBalance = useCajaStore.getState().updateBalance;
        const updateBankBalance = useCajaStore.getState().updateBankBalance;
        const amount = transaction.amount;
        const calculatedAmount = transaction.calculatedAmount;
        const bankId = transaction.bankId;

        // Always require bank selection
        if (!bankId) {
          throw new Error('Bank selection is required');
        }

        switch (transaction.currencyOperation) {
          case 'ARS_IN':
            updateCajaBalance('ARS', amount);
            updateBankBalance(bankId, 'ARS', -amount); // Decrease bank balance
            break;
          case 'ARS_OUT':
            updateCajaBalance('ARS', -amount);
            updateBankBalance(bankId, 'ARS', amount); // Increase bank balance
            break;
          case 'USDT_BUY':
            // ARS amount is what we're paying from the bank
            updateCajaBalance('ARS', -amount);
            updateBankBalance(bankId, 'ARS', -amount);
            // calculatedAmount is USDT we're receiving in cash
            if (calculatedAmount) {
              updateCajaBalance('USDT', calculatedAmount);
            }
            break;
          case 'USDT_SELL':
            // amount is USDT we're giving from cash
            updateCajaBalance('USDT', -amount);
            // calculatedAmount is ARS we're receiving in bank
            if (calculatedAmount) {
              updateCajaBalance('ARS', calculatedAmount);
              updateBankBalance(bankId, 'ARS', calculatedAmount);
            }
            break;
          case 'USDT_IN':
            updateCajaBalance('USDT', amount);
            break;
          case 'USDT_OUT':
            updateCajaBalance('USDT', -amount);
            break;
          case 'USD_IN':
            updateCajaBalance('USD', amount);
            updateBankBalance(bankId, 'USD', -amount);
            break;
          case 'USD_OUT':
            updateCajaBalance('USD', -amount);
            updateBankBalance(bankId, 'USD', amount);
            break;
          case 'USD_BUY':
            // ARS amount is what we're paying from bank
            updateCajaBalance('ARS', -amount);
            updateBankBalance(bankId, 'ARS', -amount);
            // calculatedAmount is USD we're receiving in cash
            if (calculatedAmount) {
              updateCajaBalance('USD', calculatedAmount);
            }
            break;
          case 'USD_SELL':
            // amount is USD we're giving from cash
            updateCajaBalance('USD', -amount);
            // calculatedAmount is ARS we're receiving in bank
            if (calculatedAmount) {
              updateCajaBalance('ARS', calculatedAmount);
              updateBankBalance(bankId, 'ARS', calculatedAmount);
            }
            break;
        }

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      getTransactionsByDate: (startDate: Date, endDate: Date) => {
        return get().transactions.filter(
          (transaction) =>
            transaction.date >= startDate && transaction.date <= endDate
        );
      },
    }),
    {
      name: 'transaction-storage',
    }
  )
);