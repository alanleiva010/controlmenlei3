import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency, Crypto } from '../types';

interface CurrencyStore {
  currencies: Currency[];
  cryptos: Crypto[];
  addCurrency: (currency: Omit<Currency, 'id'>) => void;
  updateCurrency: (id: string, currency: Partial<Currency>) => void;
  deleteCurrency: (id: string) => void;
  addCrypto: (crypto: Omit<Crypto, 'id'>) => void;
  updateCrypto: (id: string, crypto: Partial<Crypto>) => void;
  deleteCrypto: (id: string) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currencies: [
        { id: '1', code: 'USD', name: 'US Dollar', symbol: '$', buyRate: 3.72, sellRate: 3.75, active: true },
        { id: '2', code: 'EUR', name: 'Euro', symbol: '€', buyRate: 4.05, sellRate: 4.08, active: true },
        { id: '3', code: 'ARS', name: 'Argentine Peso', symbol: '$', buyRate: 1, sellRate: 1, active: true },
      ],
      cryptos: [
        { id: '1', name: 'Bitcoin', code: 'BTC', network: 'Bitcoin', active: true },
        { id: '2', name: 'Ethereum', code: 'ETH', network: 'Ethereum', active: true },
        { id: '3', name: 'USDT', code: 'USDT', network: 'Tron', active: true },
      ],
      addCurrency: (currency) =>
        set((state) => ({
          currencies: [...state.currencies, { ...currency, id: Math.random().toString(36).substr(2, 9) }],
        })),
      updateCurrency: (id, currency) =>
        set((state) => ({
          currencies: state.currencies.map((c) =>
            c.id === id ? { ...c, ...currency } : c
          ),
        })),
      deleteCurrency: (id) =>
        set((state) => ({
          currencies: state.currencies.filter((c) => c.id !== id),
        })),
      addCrypto: (crypto) =>
        set((state) => ({
          cryptos: [...state.cryptos, { ...crypto, id: Math.random().toString(36).substr(2, 9) }],
        })),
      updateCrypto: (id, crypto) =>
        set((state) => ({
          cryptos: state.cryptos.map((c) =>
            c.id === id ? { ...c, ...crypto } : c
          ),
        })),
      deleteCrypto: (id) =>
        set((state) => ({
          cryptos: state.cryptos.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'currency-storage',
    }
  )
);