export interface Category {
  id: string;
  userId: string | null; // null indicates system category
  name: string;
  description: string | null;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    transactions?: number;
  };
}

export interface CategoryPayload {
  name: string;
  description?: string | null;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon: string;
  sortOrder?: number;
}

export interface CategoryQueryParams {
  type?: 'INCOME' | 'EXPENSE' | 'all';
  status?: 'active' | 'archived' | 'all';
  search?: string;
}

export interface CategorySummary {
  total: number;
  income: number;
  expense: number;
  archived: number;
}
