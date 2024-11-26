import React, { useState } from 'react';
import { useCajaStore } from '../store/useCajaStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useBankStore } from '../store/useBankStore';
import { useBankBalanceStore } from '../store/useBankBalanceStore';
import { CajaHeader } from '../components/CajaHeader';
import { CashBalanceForm } from '../components/CashBalanceForm';
import { BankBalanceForm } from '../components/BankBalanceForm';
import { CurrentBalanceDisplay } from '../components/CurrentBalanceDisplay';

export function Caja() {
  const [isOpeningCash, setIsOpeningCash] = useState(false);
  const { currentBalance, openCaja, closeCaja } = useCajaStore();
  const { currencies, cryptos } = useCurrencyStore();
  const { banks } = useBankStore();
  const { bankBalances } = useBankBalanceStore();

  const activeCurrencies = currencies.filter(c => c.active);
  const activeCryptos = cryptos.filter(c => c.active);
  const activeBanks = banks.filter(b => b.active);

  const [initialAmounts, setInitialAmounts] = useState<Record<string, string>>({});
  const [initialBankAmounts, setInitialBankAmounts] = useState<Record<string, Record<string, string>>>({});

  const handleOpenCash = () => {
    const currencyBalances = [...activeCurrencies, ...activeCryptos].reduce(
      (acc, currency) => ({
        ...acc,
        [currency.code]: {
          initialAmount: parseFloat(initialAmounts[currency.code]) || 0,
          currentAmount: parseFloat(initialAmounts[currency.code]) || 0,
        },
      }),
      {}
    );

    const bankBalancesList = activeBanks.flatMap(bank =>
      activeCurrencies.map(currency => ({
        bankId: bank.id,
        currency: currency.code,
        amount: parseFloat(initialBankAmounts[bank.id]?.[currency.code] || '0'),
      }))
    );

    const balance = {
      date: new Date(),
      currencies: currencyBalances,
      bankBalances: bankBalancesList,
      isOpen: true,
      openedBy: '1',
    };

    openCaja(balance);
    setIsOpeningCash(false);
  };

  const handleAmountChange = (code: string, value: string) => {
    setInitialAmounts(prev => ({
      ...prev,
      [code]: value,
    }));
  };

  const handleBankAmountChange = (bankId: string, currencyCode: string, value: string) => {
    setInitialBankAmounts(prev => ({
      ...prev,
      [bankId]: {
        ...prev[bankId],
        [currencyCode]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <CajaHeader
        currentBalance={currentBalance}
        onOpenCaja={() => setIsOpeningCash(true)}
        onCloseCaja={closeCaja}
      />

      {isOpeningCash && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Saldos Iniciales</h2>
          
          <div className="space-y-6">
            <CashBalanceForm
              currencies={[...activeCurrencies, ...activeCryptos]}
              initialAmounts={initialAmounts}
              onAmountChange={handleAmountChange}
            />

            <BankBalanceForm
              banks={activeBanks}
              currencies={activeCurrencies}
              initialBankAmounts={initialBankAmounts}
              onBankAmountChange={handleBankAmountChange}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsOpeningCash(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleOpenCash}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Abrir Caja
            </button>
          </div>
        </div>
      )}

      {currentBalance && (
        <CurrentBalanceDisplay
          currentBalance={currentBalance}
          currencies={[...activeCurrencies, ...activeCryptos]}
          banks={activeBanks}
          bankBalances={bankBalances}
        />
      )}
    </div>
  );
}