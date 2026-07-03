import React from 'react';
import { BudgetOverview as BudgetOverviewType } from '../../types/budget';
import { DollarSign, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';

interface BudgetOverviewProps {
  overview: BudgetOverviewType | null;
  currencySymbol?: string;
  isLoading?: boolean;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  overview,
  currencySymbol = '$',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl space-y-3">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const totalBudget = overview ? Number(overview.totalBudget) : 0;
  const totalSpent = overview ? Number(overview.totalSpent) : 0;
  const remainingBudget = overview ? Number(overview.remainingBudget) : 0;
  const healthScore = overview ? overview.budgetHealthScore : 100;
  const overspentCount = overview ? overview.overspentCategories.length : 0;

  const formatCurrency = (val: number) => {
    return `${currencySymbol}${Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Health Score color selection
  let healthColor = 'text-emerald-500';
  let healthBg = 'bg-emerald-50 dark:bg-emerald-950/20';
  if (healthScore < 50) {
    healthColor = 'text-rose-500';
    healthBg = 'bg-rose-50 dark:bg-rose-950/20';
  } else if (healthScore < 85) {
    healthColor = 'text-amber-500';
    healthBg = 'bg-amber-50 dark:bg-amber-950/20';
  }

  return (
    <div className="space-y-6">
      {/* Overview stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Budget Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Budgeted
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 dark:text-indigo-400">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {formatCurrency(totalBudget)}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Total active budget allocations
          </p>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Spent
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {formatCurrency(totalSpent)}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Cumulative expenses in period
          </p>
        </div>

        {/* Remaining Budget Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Remaining Reserve
            </span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-500 dark:text-sky-400">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {formatCurrency(remainingBudget)}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Total remaining unspent amount
          </p>
        </div>

        {/* Budget Health Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Budget Health
            </span>
            <div className={`p-2 rounded-xl ${healthBg} ${healthColor}`}>
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold mt-2 ${healthColor}`}>
            {healthScore}/100
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {overspentCount > 0
              ? `${overspentCount} categories overspent`
              : 'All budget categories healthy'}
          </p>
        </div>
      </div>

      {/* Overspending alerts banner */}
      {overview && overspentCount > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-300">
              Overspending Alerts Detected
            </h4>
            <div className="mt-2 space-y-1">
              {overview.overspentCategories.map((cat, idx) => (
                <p key={idx} className="text-xs text-rose-700 dark:text-rose-400">
                  • <strong>{cat.name}</strong> has exceeded its budget of{' '}
                  {formatCurrency(cat.amount)} by{' '}
                  <span className="font-semibold">{formatCurrency(cat.overspentAmount)}</span>{' '}
                  (spent: {formatCurrency(cat.amountSpent)}).
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
