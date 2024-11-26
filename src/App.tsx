import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Transactions } from './pages/Transactions';
import { Caja } from './pages/Caja';
import { CajaHistory } from './pages/CajaHistory';
import { ClientSettings } from './pages/settings/ClientSettings';
import { ProviderSettings } from './pages/settings/ProviderSettings';
import { BankSettings } from './pages/settings/BankSettings';
import { BankBalanceSettings } from './pages/settings/BankBalanceSettings';
import { CryptoSettings } from './pages/settings/CryptoSettings';
import { CurrencySettings } from './pages/settings/CurrencySettings';
import { OperatorSettings } from './pages/settings/OperatorSettings';
import { OperationTypeSettings } from './pages/settings/OperationTypeSettings';
import { useAuthStore } from './store/useAuthStore';
import { useCajaStore } from './store/useCajaStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/caja" />} />
          <Route path="caja" element={<Caja />} />
          <Route path="caja/history" element={<CajaHistory />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings">
            <Route path="clients" element={<ClientSettings />} />
            <Route path="providers" element={<ProviderSettings />} />
            <Route path="banks" element={<BankSettings />} />
            <Route path="bank-balances" element={<BankBalanceSettings />} />
            <Route path="cryptos" element={<CryptoSettings />} />
            <Route path="currencies" element={<CurrencySettings />} />
            <Route path="operators" element={<OperatorSettings />} />
            <Route path="operation-types" element={<OperationTypeSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;