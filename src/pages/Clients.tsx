import React, { useState } from 'react';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { Client } from '../types';

export function Clients() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Smith',
      documentType: 'DNI',
      documentNumber: '12345678',
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St',
      createdAt: new Date(),
    },
    // Add more mock data as needed
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.documentNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search clients..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredClients.map((client) => (
            <li key={client.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className="font-medium text-indigo-600 truncate">
                        {client.name}
                      </p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                        ({client.documentType}: {client.documentNumber})
                      </p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>{client.email}</p>
                        <span className="mx-2">•</span>
                        <p>{client.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-indigo-600">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600">
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}