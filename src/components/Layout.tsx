import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Calculator,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                MENLEI
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link
                    to="/caja"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname.startsWith('/caja') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                    }`}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Caja
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/transactions"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/transactions' ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                    }`}
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Transactions
                  </Link>
                  <div className="relative settings-menu">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname.startsWith('/settings') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                      }`}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                      <ChevronDown className={`ml-2 w-4 h-4 transform transition-transform ${showSettings ? 'rotate-180' : ''}`} />
                    </button>
                    {showSettings && (
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1" role="menu">
                          <Link
                            to="/settings/clients"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Clients
                          </Link>
                          <Link
                            to="/settings/providers"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Providers
                          </Link>
                          <Link
                            to="/settings/banks"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Banks
                          </Link>
                          <Link
                            to="/settings/bank-balances"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Bank Balances
                          </Link>
                          <Link
                            to="/settings/cryptos"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Cryptocurrencies
                          </Link>
                          <Link
                            to="/settings/currencies"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Currencies
                          </Link>
                          <Link
                            to="/settings/operators"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Operators
                          </Link>
                          <Link
                            to="/settings/operation-types"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Tipos de Operación
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}