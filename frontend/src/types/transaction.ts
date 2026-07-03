export type PaymentMethodType = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'UPI' | 'Wallet' | 'Other';

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string | null;
  category?: {
    name: string;
    color: string;
    icon: string;
  } | null;
  title: string;
  description: string | null;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  paymentMethod: PaymentMethodType;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionPayload {
  title: string;
  description?: string | null;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId?: string | null;
  date: string;
  paymentMethod: PaymentMethodType;
  notes?: string | null;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  type?: 'INCOME' | 'EXPENSE' | 'all';
  categoryId?: string | 'all';
  paymentMethod?: PaymentMethodType | 'all';
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'date' | 'amount' | 'title';
  sortDir?: 'asc' | 'desc';
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  thisMonthCount: number;
}

export interface TransactionsResponse {
  success: boolean;
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  summary: TransactionSummary;
}
