import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Transaction, Client } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

interface TransactionDetailsProps {
  transaction: Transaction;
  client?: Client;
  onClose: () => void;
}

export function TransactionDetails({ transaction, client, onClose }: TransactionDetailsProps) {
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Detalles de la Transacción</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Fecha y Hora</h4>
          <p className="mt-1 text-sm text-gray-900">
            {format(new Date(transaction.date), 'dd/MM/yyyy HH:mm:ss')}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
          <p className="mt-1 text-sm text-gray-900">
            {client?.name || 'N/A'}
            {client && (
              <>
                <br />
                <span className="text-gray-500">{client.email}</span>
                <br />
                <span className="text-gray-500">{client.phone}</span>
              </>
            )}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Tipo de Operación</h4>
          <p className="mt-1 text-sm text-gray-900">{transaction.operationType}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Operación</h4>
          <p className="mt-1 text-sm text-gray-900">{transaction.currencyOperation}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Monto</h4>
          <p className="mt-1 text-sm text-gray-900">
            {formatCurrency(transaction.amount, transaction.currencyOperation)}
          </p>
        </div>

        {transaction.exchangeRate && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Tipo de Cambio</h4>
            <p className="mt-1 text-sm text-gray-900">{transaction.exchangeRate.toFixed(4)}</p>
          </div>
        )}

        {transaction.calculatedAmount && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Monto Final</h4>
            <p className="mt-1 text-sm text-gray-900">
              {formatCurrency(
                transaction.calculatedAmount,
                transaction.currencyOperation.includes('BUY') ? 
                  transaction.currencyOperation.replace('BUY', 'IN') : 
                  'ARS_IN'
              )}
            </p>
          </div>
        )}

        {transaction.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
            <p className="mt-1 text-sm text-gray-900">{transaction.description}</p>
          </div>
        )}

        {transaction.attachmentUrl && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Documentación</h4>
            <div className="mt-1 flex items-center">
              <a
                href={transaction.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                {transaction.attachmentName || 'Ver documento'}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}