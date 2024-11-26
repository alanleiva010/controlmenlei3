import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Currency } from '../types';

const currencySchema = z.object({
  code: z.string().min(1, 'Code is required').max(5),
  name: z.string().min(1, 'Name is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  buyRate: z.number().min(0, 'Buy rate must be positive'),
  sellRate: z.number().min(0, 'Sell rate must be positive'),
});

type CurrencyFormData = z.infer<typeof currencySchema>;

interface CurrencyFormProps {
  onSubmit: (data: CurrencyFormData) => void;
  onCancel: () => void;
  initialData?: Currency;
}

export function CurrencyForm({ onSubmit, onCancel, initialData }: CurrencyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Currency Code
        </label>
        <input
          type="text"
          {...register('code')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="USD"
        />
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Currency Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="US Dollar"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Symbol</label>
        <input
          type="text"
          {...register('symbol')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="$"
        />
        {errors.symbol && (
          <p className="mt-1 text-sm text-red-600">{errors.symbol.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Buy Rate</label>
        <input
          type="number"
          step="0.0001"
          {...register('buyRate', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.buyRate && (
          <p className="mt-1 text-sm text-red-600">{errors.buyRate.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sell Rate</label>
        <input
          type="number"
          step="0.0001"
          {...register('sellRate', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.sellRate && (
          <p className="mt-1 text-sm text-red-600">{errors.sellRate.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}