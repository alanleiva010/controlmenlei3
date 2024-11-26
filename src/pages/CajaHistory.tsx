import React, { useState } from 'react';
import { format } from 'date-fns';
import { useCajaStore } from '../store/useCajaStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useBankStore } from '../store/useBankStore';
import { useOperatorStore } from '../store/useOperatorStore';
import { formatCurrency } from '../utils/formatCurrency';

export function CajaHistory() {
  const { history } = useCajaStore();
  const { currencies, cryptos } = useCurrencyStore();
  const { banks } = useBankStore();
  const { operators } = useOperatorStore();
  const allCurrencies = [...currencies, ...cryptos].filter(c => c.active);

  const [timeFilter, setTimeFilter] = useState('day'); // 'day', 'week', 'month', 'year', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filteredHistory = history
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getOperatorName = (id: string) => {
    const operator = operators.find(op => op.id === id);
    return operator ? operator.name : `Operador ID: ${id}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Historial de Caja</h1>
        <div className="flex space-x-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="year">Año</option>
            <option value="custom">Personalizado</option>
          </select>

          {timeFilter === 'custom' && (
            <div className="flex space-x-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredHistory.map((record) => (
            <li key={record.date.toString()} className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {format(new Date(record.date), 'dd/MM/yyyy HH:mm')}
                </h3>
                <p className="text-sm text-gray-500">
                  {record.isOpen ? 'Abierto' : 'Cerrado'} por {getOperatorName(record.openedBy)}
                  {record.closedBy && ` - Cerrado por ${getOperatorName(record.closedBy)}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCurrencies.map((currency) => {
                  const amounts = record.currencies[currency.code];
                  if (!amounts) return null;

                  return (
                    <div
                      key={`${record.date.toString()}-${currency.code}`}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">
                          {currency.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {currency.code}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Inicial</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(amounts.initialAmount, `${currency.code}_IN`)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Final</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(amounts.currentAmount, `${currency.code}_IN`)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Diferencia</p>
                          <p
                            className={`text-sm font-medium ${
                              amounts.currentAmount - amounts.initialAmount >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {formatCurrency(
                              amounts.currentAmount - amounts.initialAmount,
                              `${currency.code}_IN`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {record.bankBalances && record.bankBalances.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Saldos Bancarios
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {record.bankBalances.map((balance, index) => {
                      const bank = banks.find((b) => b.id === balance.bankId);
                      if (!bank) return null;

                      return (
                        <div
                          key={`${record.date.toString()}-${balance.bankId}-${balance.currency}-${index}`}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">
                              {bank.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {balance.currency}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            Saldo: {formatCurrency(balance.amount, `${balance.currency}_IN`)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}