import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client, Bank } from '../types';
import { useOperationTypeStore } from '../store/useOperationTypeStore';
import { Upload, X } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
];

// Operations that don't require bank selection
const NO_BANK_OPERATIONS = [
  'USDT_IN',
  'USDT_OUT',
  'USD_IN',
  'USD_OUT',
];

const transactionSchema = z.object({
  clientId: z.string().min(1, 'Cliente es requerido'),
  operationType: z.string().min(1, 'Tipo de operación es requerido'),
  currencyOperation: z.string().min(1, 'Operación es requerida'),
  bankId: z.string().optional(),
  amount: z.number().min(0, 'El monto debe ser positivo'),
  exchangeRate: z.number().optional(),
  calculatedAmount: z.number().optional(),
  description: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  clients: Client[];
  banks: Bank[];
  onSubmit: (data: TransactionFormData & { 
    attachmentUrl?: string;
    attachmentName?: string;
  }) => void;
  onCancel: () => void;
}

export function TransactionForm({ clients, banks, onSubmit, onCancel }: TransactionFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { operationTypes } = useOperationTypeStore();
  const activeOperationTypes = operationTypes.filter(t => t.active);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  });

  const currencyOperation = watch('currencyOperation');
  const amount = watch('amount');
  const exchangeRate = watch('exchangeRate');

  const requiresBank = !NO_BANK_OPERATIONS.includes(currencyOperation);

  React.useEffect(() => {
    if (amount && exchangeRate && (currencyOperation?.includes('BUY') || currencyOperation?.includes('SELL'))) {
      const calculatedAmount = currencyOperation?.includes('BUY') 
        ? amount / exchangeRate 
        : amount * exchangeRate;
      setValue('calculatedAmount', calculatedAmount);
    }
  }, [amount, exchangeRate, currencyOperation, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      alert('Tipo de archivo no soportado. Use PDF, JPG o PNG.');
      return;
    }

    setSelectedFile(file);
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    let attachmentUrl = '';
    let attachmentName = '';

    if (selectedFile) {
      attachmentUrl = URL.createObjectURL(selectedFile);
      attachmentName = selectedFile.name;
    }

    onSubmit({
      ...data,
      attachmentUrl,
      attachmentName,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Cliente</label>
        <select
          {...register('clientId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Seleccionar cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Operación
        </label>
        <select
          {...register('currencyOperation')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Seleccionar operación</option>
          <option value="ARS_IN">Entrada de ARS</option>
          <option value="ARS_OUT">Salida de ARS</option>
          <option value="USDT_BUY">Compra de USDT</option>
          <option value="USDT_SELL">Venta de USDT</option>
          <option value="USDT_IN">Entrada de USDT</option>
          <option value="USDT_OUT">Salida de USDT</option>
          <option value="USD_IN">Entrada de USD</option>
          <option value="USD_OUT">Salida de USD</option>
          <option value="USD_BUY">Compra de USD</option>
          <option value="USD_SELL">Venta de USD</option>
        </select>
        {errors.currencyOperation && (
          <p className="mt-1 text-sm text-red-600">{errors.currencyOperation.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de operación
        </label>
        <select
          {...register('operationType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Seleccionar tipo</option>
          {activeOperationTypes.map((type) => (
            <option key={type.id} value={type.code}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.operationType && (
          <p className="mt-1 text-sm text-red-600">{errors.operationType.message}</p>
        )}
      </div>

      {requiresBank && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Banco</label>
          <select
            {...register('bankId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccionar banco</option>
            {banks.filter(b => b.active).map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
          {errors.bankId && (
            <p className="mt-1 text-sm text-red-600">{errors.bankId.message}</p>
          )}
        </div>
      )}

      {currencyOperation && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {currencyOperation.includes('BUY') ? 'Monto en ARS a entregar' : 'Monto'}
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {(currencyOperation === 'USDT_BUY' || 
            currencyOperation === 'USDT_SELL' || 
            currencyOperation === 'USD_BUY' || 
            currencyOperation === 'USD_SELL') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cotización
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('exchangeRate', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {currencyOperation.includes('BUY') 
                    ? `Cantidad de ${currencyOperation.includes('USDT') ? 'USDT' : 'USD'} a recibir`
                    : `Cantidad de ARS a recibir`}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount && exchangeRate ? (
                    currencyOperation.includes('BUY') 
                      ? (amount / exchangeRate).toFixed(2)
                      : (amount * exchangeRate).toFixed(2)
                  ) : ''}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </>
          )}
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Documentación (opcional)
        </label>
        <div className="mt-1 flex items-center">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
            <div className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              {selectedFile ? selectedFile.name : 'Subir archivo'}
            </div>
            <input
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept={ACCEPTED_FILE_TYPES.join(',')}
            />
          </label>
          {selectedFile && (
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="ml-2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          PDF, JPG o PNG. Máximo 5MB.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}