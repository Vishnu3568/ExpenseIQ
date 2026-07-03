import React from 'react';
import { BudgetProgress } from '../../types/budget';
import { Calendar, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface BudgetCardProps {
  budget: BudgetProgress;
  currencySymbol?: string;
  onEditClick: (budget: BudgetProgress) => void;
  onDeleteClick: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  currencySymbol = '$',
  onEditClick,
  onDeleteClick,
}) => {
  const amount = Number(budget.amount);
  const amountSpent = Number(budget.amountSpent);
  const utilization = Number(budget.budgetUtilization);

  const formatCurrency = (val: number) => {
    return `${currencySymbol}${Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Color coding calculation based on utilization
  let progressColor = 'bg-emerald-500';
  let ringColor = 'stroke-emerald-500';
  let cardBgBorder = 'border-slate-100 dark:border-slate-800/80';

  if (utilization >= 100) {
    progressColor = 'bg-rose-500';
    ringColor = 'stroke-rose-500';
    cardBgBorder = 'border-rose-100 dark:border-rose-950/40 bg-rose-50/10 dark:bg-rose-950/5';
  } else if (utilization >= 80) {
    progressColor = 'bg-amber-500';
    ringColor = 'stroke-amber-500';
    cardBgBorder = 'border-amber-100 dark:border-amber-950/40 bg-amber-50/10 dark:bg-amber-950/5';
  }

  // Circular progress properties
  const radius = 32;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, utilization) / 100) * circumference;

  return (
    <div
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group ${cardBgBorder}`}
    >
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider mb-2 ${
                budget.type === 'OVERALL'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400'
                  : 'bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400'
              }`}
            >
              {budget.type === 'OVERALL' ? 'Overall Monthly' : 'Category Budget'}
            </span>
            <h4 className="text-base font-bold text-slate-800 dark:text-white truncate">
              {budget.name}
            </h4>
          </div>

          {/* SVG Circular Progress Ring */}
          <div className="relative h-18 w-18 flex items-center justify-center shrink-0">
            <svg className="h-full w-full transform -rotate-90">
              <circle
                className="stroke-slate-100 dark:stroke-slate-800"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx="36"
                cy="36"
              />
              <circle
                className={`transition-all duration-500 ${ringColor}`}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                r={radius}
                cx="36"
                cy="36"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {Math.round(utilization)}%
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {budget.notes && (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-1 line-clamp-1">
            {budget.notes}
          </p>
        )}

        {/* Spent vs Budget info */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
              Spent
            </span>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              {formatCurrency(amountSpent)}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
              Budget Limit
            </span>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {formatCurrency(amount)}
            </p>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(100, utilization)}%` }}
          />
        </div>

        {/* Overspending Indicator */}
        {budget.overspendingDetection && (
          <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2 animate-pulse">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Overspent by {formatCurrency(amountSpent - amount)}</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 mt-5 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {budget.daysRemaining > 0
              ? `${budget.daysRemaining} days left`
              : 'Period ended'}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEditClick(budget)}
            className="h-7 w-7 p-0 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteClick(budget.id)}
            className="h-7 w-7 p-0 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default BudgetCard;
