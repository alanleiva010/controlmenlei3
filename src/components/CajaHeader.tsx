import React from 'react';
import { Link } from 'react-router-dom';
import { History, Lock, Unlock } from 'lucide-react';
import { DailyBalance } from '../types';

interface CajaHeaderProps {
  currentBalance: DailyBalance | null;
  onOpenCaja: () => void;
  onCloseCaja: (userId: string) => void;
}

export function CajaHeader({ currentBalance, onOpenCaja, onCloseCaja }: CajaHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Caja Diaria</h1>
      <div className="flex space-x-4">
        <Link
          to="/caja/history"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <History className="h-4 w-4 mr-2" />
          Ver Historial
        </Link>
        {currentBalance?.isOpen ? (
          <button
            onClick={() => onCloseCaja('1')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <Lock className="h-4 w-4 mr-2" />
            Cerrar Caja
          </button>
        ) : (
          <button
            onClick={onOpenCaja}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Unlock className="h-4 w-4 mr-2" />
            Abrir Caja
          </button>
        )}
      </div>
    </div>
  );
}