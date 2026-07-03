import { Category } from './category';

export interface Budget {
  id: string;
  userId: string;
  categoryId: string | null;
  category?: Category | null;
  name: string;
  amount: number | string;
  type: 'OVERALL' | 'CATEGORY';
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  notes?: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetProgress extends Budget {
  amountSpent: number;
  remainingBudget: number;
  remainingPercentage: number;
  budgetProgress: number;
  daysRemaining: number;
  dailyRecommendedSpending: number;
  overspendingDetection: boolean;
  budgetUtilization: number;
}

export interface BudgetOverview {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  overspentCategories: Array<{
    categoryId: string | null;
    name: string;
    amount: number;
    amountSpent: number;
    overspentAmount: number;
  }>;
  budgetHealthScore: number;
}

export interface BudgetPayload {
  name: string;
  amount: number;
  type: 'OVERALL' | 'CATEGORY';
  categoryId?: string | null;
  startDate: string;
  endDate: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  notes?: string | null;
}
