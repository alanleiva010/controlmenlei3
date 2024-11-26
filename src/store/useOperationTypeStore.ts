import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OperationType } from '../types';

interface OperationTypeStore {
  operationTypes: OperationType[];
  addOperationType: (operationType: Omit<OperationType, 'id' | 'active'>) => void;
  updateOperationType: (id: string, operationType: Partial<OperationType>) => void;
  deleteOperationType: (id: string) => void;
}

const defaultOperationTypes: OperationType[] = [
  {
    id: '1',
    name: 'Operación de cambio',
    code: 'EXCHANGE',
    description: 'Operaciones de cambio de divisas',
    active: true,
  },
  {
    id: '2',
    name: 'Liquidación Recaudadora',
    code: 'COLLECTION_SETTLEMENT',
    description: 'Liquidación de fondos recaudados',
    active: true,
  },
  {
    id: '3',
    name: 'Depósito de Recaudadora',
    code: 'COLLECTION_DEPOSIT',
    description: 'Depósito de fondos recaudados',
    active: true,
  },
  {
    id: '4',
    name: 'Depósito de Préstamos',
    code: 'LOAN_DEPOSIT',
    description: 'Depósito de fondos de préstamos',
    active: true,
  },
  {
    id: '5',
    name: 'Salida de préstamos',
    code: 'LOAN_WITHDRAWAL',
    description: 'Retiro de fondos para préstamos',
    active: true,
  },
  {
    id: '6',
    name: 'Operación Interna',
    code: 'INTERNAL_OPERATION',
    description: 'Operaciones internas de la empresa',
    active: true,
  },
];

export const useOperationTypeStore = create<OperationTypeStore>()(
  persist(
    (set) => ({
      operationTypes: defaultOperationTypes,
      addOperationType: (operationType) =>
        set((state) => ({
          operationTypes: [
            ...state.operationTypes,
            { ...operationType, id: Math.random().toString(36).substr(2, 9), active: true },
          ],
        })),
      updateOperationType: (id, operationType) =>
        set((state) => ({
          operationTypes: state.operationTypes.map((op) =>
            op.id === id ? { ...op, ...operationType } : op
          ),
        })),
      deleteOperationType: (id) =>
        set((state) => ({
          operationTypes: state.operationTypes.filter((op) => op.id !== id),
        })),
    }),
    {
      name: 'operation-type-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);