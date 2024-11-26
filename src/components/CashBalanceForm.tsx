import React from 'react';
import { DollarSign } from 'lucide-react';
import { Currency, Crypto } from '../types';

interface CashBalanceFormProps {
  currencies: (Currency | Crypto)[];
  initialAmounts: Record<string, string>;
  onAmountChange: (code: string, value: string) => void;
}

export function CashBalanceForm({ currencies, initialAmounts, onAmountChange }: CashBalanceFormProps) {
  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">Saldos de Caja</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currencies.map((currency) => (
          <div key={`initial-cash-${currency.code}`}>
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
                onChange={(e) => onAmountChange(currency.code, e.target.value)}
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
    </div>
  );
}