export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  types?: ('INCOME' | 'EXPENSE')[];
  paymentMethods?: string[];
  minAmount?: number;
  maxAmount?: number;
  budgetId?: string;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  largestExpense: number;
  largestIncome: number;
  averageDailySpend: number;
  averageMonthlySpend: number;
  budgetUtilization: number;
  overspendingCategoriesCount: number;
  transactionCount: number;
}

export interface ReportTransactionItem {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: string;
  paymentMethod: string;
  categoryName: string;
  categoryColor: string;
}

export interface ReportCategoryBreakdownItem {
  id: string | null;
  name: string;
  color: string;
  icon: string;
  type: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface ReportDetails {
  id?: string;
  name: string;
  type: string;
  filters: ReportFilter;
  template: string;
  userName: string;
  generatedAt: string;
  summary: ReportSummary;
  transactions: ReportTransactionItem[];
  categoryBreakdown: ReportCategoryBreakdownItem[];
  version: string;
}
