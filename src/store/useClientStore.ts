import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client } from '../types';

interface ClientStore {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      clients: [],
      addClient: (client) =>
        set((state) => ({
          clients: [
            ...state.clients,
            { ...client, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      updateClient: (id, client) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...client } : c
          ),
        })),
      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'client-storage',
    }
  )
);