import React, { useState } from 'react';
import { Calculator, DollarSign, Lock, Unlock } from 'lucide-react';
import { useDailyBalanceStore } from '../store/useDailyBalanceStore';

export function DailyOperations() {
  const [isOpeningCash, setIsOpeningCash] = useState(false);
  const { currentBalance, openDaily, closeDaily } = useDailyBalanceStore();

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'BRL', name: 'Brazilian Real' },
  ];

  const [initialAmounts, setInitialAmounts] = useState<Record<string, string>>({});

  const handleOpenCash = () => {
    const balance = {
      date: new Date(),
      currencies: Object.entries(initialAmounts).reduce(
        (acc, [code, amount]) => ({
          ...acc,
          [code]: {
            initialAmount: parseFloat(amount) || 0,
            currentAmount: parseFloat(amount) || 0,
          },
        }),
        {}
      ),
      isOpen: true,
      openedBy: '1', // In a real app, this would be the current user's ID
    };
    openDaily(balance);
    setIsOpeningCash(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Daily Cash Register</h2>
            {currentBalance?.isOpen ? (
              <button
                onClick={() => closeDaily('1')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Close Register
              </button>
            ) : (
              <button
                onClick={() => setIsOpeningCash(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Open Register
              </button>
            )}
          </div>

          {isOpeningCash && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Enter Initial Amounts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currencies.map((currency) => (
                  <div key={currency.code}>
                    <label
                      htmlFor={currency.code}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {currency.name}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id={currency.code}
                        value={initialAmounts[currency.code] || ''}
                        onChange={(e) =>
                          setInitialAmounts((prev) => ({
                            ...prev,
                            [currency.code]: e.target.value,
                          }))
                        }
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                          {currency.code}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsOpeningCash(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOpenCash}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Open Register
                </button>
              </div>
            </div>
          )}

          {currentBalance && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currentBalance.currencies).map(([code, amounts]) => (
                  <div
                    key={code}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calculator className="h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {code}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        Balance
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Initial</p>
                        <p className="text-sm font-medium text-gray-900">
                          {amounts.initialAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current</p>
                        <p className="text-sm font-medium text-gray-900">
                          {amounts.currentAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Difference</p>
                        <p
                          className={`text-sm font-medium ${
                            amounts.currentAmount - amounts.initialAmount >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {(amounts.currentAmount - amounts.initialAmount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}