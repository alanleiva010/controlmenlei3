import React, { useState } from 'react';
import { Plus, Search, ArrowRight, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useTransactionStore } from '../store/useTransactionStore';
import { useClientStore } from '../store/useClientStore';
import { useCajaStore } from '../store/useCajaStore';
import { useBankStore } from '../store/useBankStore';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionDetails } from '../components/TransactionDetails';
import { formatCurrency } from '../utils/formatCurrency';

export function Transactions() {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('day');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const { transactions, addTransaction } = useTransactionStore();
  const { clients } = useClientStore();
  const { currentBalance } = useCajaStore();
  const { banks } = useBankStore();

  const handleNewTransaction = (data: any) => {
    addTransaction({
      ...data,
      date: new Date(),
      operatorId: '1',
    });
    setShowForm(false);
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Apply date filter
    switch (timeFilter) {
      case 'day':
        filtered = filtered.filter(t => new Date(t.date) >= startOfDay);
        break;
      case 'week':
        const lastWeek = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(t => new Date(t.date) >= lastWeek);
        break;
      case 'month':
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
        filtered = filtered.filter(t => new Date(t.date) >= lastMonth);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          filtered = filtered.filter(t => {
            const date = new Date(t.date);
            return date >= start && date <= end;
          });
        }
        break;
    }

    // Apply search filter
    return filtered.filter(
      (transaction) =>
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clients.find((c) => c.id === transaction.clientId)?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.operationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.currencyOperation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleExportCSV = () => {
    const filteredData = getFilteredTransactions();
    const csvContent = [
      ['Date', 'Client', 'Type', 'Operation', 'Amount', 'Exchange Rate', 'Calculated Amount', 'Description'].join(','),
      ...filteredData.map(t => [
        format(new Date(t.date), 'yyyy-MM-dd HH:mm'),
        clients.find(c => c.id === t.clientId)?.name,
        t.operationType,
        t.currencyOperation,
        t.amount,
        t.exchangeRate || '',
        t.calculatedAmount || '',
        `"${t.description || ''}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateTicket = (transaction: any) => {
    const client = clients.find(c => c.id === transaction.clientId);
    const ticketContent = `
      <html>
        <head>
          <title>Comprobante de Transacción</title>
          <style>
            @page { margin: 0; }
            body { 
              font-family: Arial; 
              margin: 0;
              padding: 10px;
              width: 80mm;
              font-size: 12px;
            }
            .header { 
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .detail { 
              margin: 10px 0;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            .detail p {
              margin: 5px 0;
              display: flex;
              justify-content: space-between;
            }
            .footer { 
              margin-top: 15px;
              text-align: center;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">MENLEI</div>
            <p>Comprobante de Transacción</p>
          </div>
          <div class="detail">
            <p><span>Fecha:</span> <span>${format(new Date(transaction.date), 'dd/MM/yyyy HH:mm')}</span></p>
            <p><span>Cliente:</span> <span>${client?.name || '-'}</span></p>
            <p><span>Operación:</span> <span>${transaction.operationType}</span></p>
            <p><span>Monto:</span> <span>${formatCurrency(transaction.amount, transaction.currencyOperation)}</span></p>
            ${transaction.exchangeRate ? `<p><span>Tipo de Cambio:</span> <span>${transaction.exchangeRate.toFixed(2)}</span></p>` : ''}
            ${transaction.calculatedAmount ? `<p><span>Monto Final:</span> <span>${formatCurrency(transaction.calculatedAmount, transaction.currencyOperation.includes('BUY') ? transaction.currencyOperation.replace('BUY', 'IN') : 'ARS_IN')}</span></p>` : ''}
            ${transaction.description ? `<p><span>Descripción:</span> <span>${transaction.description}</span></p>` : ''}
          </div>
          <div class="footer">
            <p>¡Gracias por elegirnos!</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([ticketContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recibo_${transaction.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTransactionAmount = (transaction: any) => {
    if (transaction.currencyOperation.includes('BUY')) {
      return (
        <>
          {formatCurrency(transaction.amount, 'ARS_IN')}
          {transaction.calculatedAmount && (
            <>
              <ArrowRight className="inline-block h-4 w-4 mx-2" />
              {formatCurrency(
                transaction.calculatedAmount,
                transaction.currencyOperation.replace('BUY', 'IN')
              )}
            </>
          )}
        </>
      );
    } else if (transaction.currencyOperation.includes('SELL')) {
      return (
        <>
          {formatCurrency(transaction.amount, transaction.currencyOperation)}
          {transaction.calculatedAmount && (
            <>
              <ArrowRight className="inline-block h-4 w-4 mx-2" />
              {formatCurrency(transaction.calculatedAmount, 'ARS_IN')}
            </>
          )}
        </>
      );
    }
    return formatCurrency(transaction.amount, transaction.currencyOperation);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Transacciones</h1>
        {currentBalance?.isOpen ? (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Transacción
          </button>
        ) : (
          <div className="text-sm text-red-600">La caja debe estar abierta para realizar transacciones</div>
        )}
      </div>

      {showForm ? (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Nueva Transacción
            </h3>
            <TransactionForm
              clients={clients}
              banks={banks}
              onSubmit={handleNewTransaction}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar transacciones..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
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

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FileText className="h-4 w-4 mr-2" />
                Exportar CSV
              </button>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operación
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredTransactions().map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(transaction.date), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {clients.find((c) => c.id === transaction.clientId)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.operationType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.currencyOperation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTransactionAmount(transaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completada
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setShowDetails(transaction.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Detalles
                      </button>
                      <button
                        onClick={() => handleGenerateTicket(transaction)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <TransactionDetails
              transaction={transactions.find(t => t.id === showDetails)!}
              client={clients.find(c => c.id === transactions.find(t => t.id === showDetails)?.clientId)}
              onClose={() => setShowDetails(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}