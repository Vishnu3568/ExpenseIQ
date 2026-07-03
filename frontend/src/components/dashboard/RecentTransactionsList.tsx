import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { Link } from 'react-router-dom';

interface RecentTransactionsListProps {
  transactions: Transaction[];
  currencySymbol?: string;
  isLoading?: boolean;
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions,
  currencySymbol = '$',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-400 dark:text-slate-500">
        No recent transactions found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'INCOME';
          const catColor = tx.category?.color || '#6B7280';
          const catName = tx.category?.name || 'Uncategorized';

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-10 w-10 flex items-center justify-center rounded-full text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: catColor }}
                >
                  <span className="text-sm font-semibold uppercase">
                    {catName.substring(0, 2)}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {tx.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {tx.paymentMethod && ` • ${tx.paymentMethod}`}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <span
                  className={`text-sm font-semibold ${
                    isIncome
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {currencySymbol}
                  {Number(tx.amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <Link
          to="/transactions"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 rounded-lg"
        >
          <span>View All Transactions</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
