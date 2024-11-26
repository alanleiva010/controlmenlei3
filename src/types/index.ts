// Previous types remain the same...

export interface Operator {
  id: string;
  name: string;
  email: string;
  password: string; // Add password field
  role: 'admin' | 'operator' | 'cashier';
  permissions: {
    clients: boolean;
    providers: boolean;
    banks: boolean;
    cryptos: boolean;
    currencies: boolean;
    operators: boolean;
    transactions: boolean;
    reports: boolean;
  };
  active: boolean;
}