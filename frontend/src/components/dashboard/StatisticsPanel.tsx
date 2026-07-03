import React from 'react';
import { StatisticsData } from '../../types/insight';
import { CalendarDays, Landmark, TrendingUp, TrendingDown } from 'lucide-react';

interface StatisticsPanelProps {
  stats: StatisticsData | null;
  currencySymbol?: string;
  isLoading?: boolean;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  stats,
  currencySymbol = '$',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl space-y-3">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-6 text-sm text-slate-400 dark:text-slate-500">
        No statistics available
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return `${currencySymbol}${Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const cards = [
    {
      title: 'Average Daily Spend',
      value: formatCurrency(stats.averageDailySpend),
      description: 'Based on total expense over active days span',
      icon: CalendarDays,
      iconColor: 'text-sky-500 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/20',
    },
    {
      title: 'Average Monthly Spend',
      value: formatCurrency(stats.averageMonthlySpend),
      description: 'Based on total expense over active months span',
      icon: Landmark,
      iconColor: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    },
    {
      title: 'Highest Spending Day',
      value: formatDate(stats.highestSpendingDay),
      description: stats.largestExpense > 0 ? `Peak expense: ${formatCurrency(stats.largestExpense)}` : 'No expenses recorded',
      icon: TrendingDown,
      iconColor: 'text-rose-500 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    },
    {
      title: 'Highest Income Day',
      value: formatDate(stats.highestIncomeDay),
      description: stats.largestIncome > 0 ? `Peak income: ${formatCurrency(stats.largestIncome)}` : 'No income recorded',
      icon: TrendingUp,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${card.bgColor}`}>
                <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
            </div>

            <div className="mt-3.5">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white truncate">
                {card.value}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
