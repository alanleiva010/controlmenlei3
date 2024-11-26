import React from 'react';
import { Plus } from 'lucide-react';

export function ProviderSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Provider Settings</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Provider Types</h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Bank Provider</p>
                <p className="text-sm text-gray-500">Providers for bank transfers and operations</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Crypto Provider</p>
                <p className="text-sm text-gray-500">Cryptocurrency exchange providers</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}