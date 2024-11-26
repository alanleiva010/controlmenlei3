import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Bank } from '../types';

interface BankStore {
  banks: Bank[];
  addBank: (bank: Omit<Bank, 'id'>) => void;
  updateBank: (id: string, bank: Partial<Bank>) => void;
  deleteBank: (id: string) => void;
}

const defaultBanks: Bank[] = [
  { id: '1', name: 'Bank of America', code: 'BOA', country: 'USA', active: true },
  { id: '2', name: 'BBVA', code: 'BBVA', country: 'Spain', active: true },
];

export const useBankStore = create<BankStore>()(
  persist(
    (set) => ({
      banks: defaultBanks,
      addBank: (bank) =>
        set((state) => ({
          banks: [...state.banks, { ...bank, id: Math.random().toString(36).substr(2, 9) }],
        })),
      updateBank: (id, bank) =>
        set((state) => ({
          banks: state.banks.map((b) => (b.id === id ? { ...b, ...bank } : b)),
        })),
      deleteBank: (id) =>
        set((state) => ({
          banks: state.banks.filter((b) => b.id !== id),
        })),
    }),
    {
      name: 'bank-storage',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version) => {
        if (version === 0 || version === 1) {
          // Reset to default state for all previous versions
          return { banks: defaultBanks };
        }
        return persistedState as BankStore;
      },
    }
  )
);