export interface OverviewData {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
}

export interface MonthlyBreakdownItem {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  balance: number;
}

export interface WeeklyBreakdownItem {
  weekStarting: string; // YYYY-MM-DD
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdownItem {
  categoryId: string | null;
  name: string;
  color: string;
  icon: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface StatisticsData {
  largestIncome: number;
  largestExpense: number;
  averageIncome: number;
  averageExpense: number;
  highestSpendingDay: string | null;
  highestIncomeDay: string | null;
  averageDailySpend: number;
  averageMonthlySpend: number;
}

export interface CashflowItem {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
}
