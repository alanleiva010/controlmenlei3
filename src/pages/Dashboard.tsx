import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import { format, subDays, subMonths, isWithinInterval } from 'date-fns';
import { useTransactionStore } from '../store/useTransactionStore';
import { useClientStore } from '../store/useClientStore';
import { useCajaStore } from '../store/useCajaStore';

export function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('day');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const { transactions } = useTransactionStore();
  const { clients } = useClientStore();
  const { currentBalance } = useCajaStore();

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate = now;

    switch (timeFilter) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          return transactions.filter(t => {
            const date = new Date(t.date);
            return isWithinInterval(date, {
              start: new Date(customStartDate),
              end: new Date(customEndDate),
            });
          });
        }
        return transactions;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  }, [transactions, timeFilter, customStartDate, customEndDate]);

  const metrics = useMemo(() => {
    const usdtVolume = filteredTransactions
      .filter(t => t.currencyOperation.includes('USDT'))
      .reduce((acc, t) => acc + (t.calculatedAmount || t.amount), 0);

    const arsVolume = filteredTransactions
      .filter(t => !t.currencyOperation.includes('USDT'))
      .reduce((acc, t) => acc + (t.calculatedAmount || t.amount), 0);

    return {
      usdtVolume,
      arsVolume,
      transactionCount: filteredTransactions.length,
      clientCount: clients.length,
    };
  }, [filteredTransactions, clients]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="day">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="custom">Personalizado</option>
          </select>

          {timeFilter === 'custom' && (
            <div className="flex gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Volumen USDT</p>
              <p className="text-lg font-semibold text-gray-900">
                {metrics.usdtVolume.toFixed(2)} USDT
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Volumen ARS</p>
              <p className="text-lg font-semibold text-gray-900">
                ${metrics.arsVolume.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Transacciones</p>
              <p className="text-lg font-semibold text-gray-900">
                {metrics.transactionCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Caja</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentBalance?.isOpen ? 'Abierta' : 'Cerrada'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Transacciones Recientes</h2>
            <div className="space-y-4">
              {filteredTransactions.slice(0, 5).map((transaction) => {
                const client = clients.find(c => c.id === transaction.clientId);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.currencyOperation.includes('BUY')
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {transaction.currencyOperation.includes('BUY') ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <DollarSign className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {client?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.currencyOperation} - {transaction.amount.toFixed(2)}
                          {transaction.calculatedAmount && 
                            ` → ${transaction.calculatedAmount.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'HH:mm')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Clientes</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Clientes Activos
                    </p>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {metrics.clientCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}