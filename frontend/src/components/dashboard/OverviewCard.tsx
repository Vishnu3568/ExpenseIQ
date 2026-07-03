import React from 'react';
import { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconColorClass?: string;
  bgColorClass?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconColorClass = 'text-indigo-600 dark:text-indigo-400',
  bgColorClass = 'bg-indigo-50 dark:bg-indigo-950/50',
  trend,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 transition-all duration-300 group flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${bgColorClass} group-hover:scale-105 transition-transform duration-300`}>
          <Icon className={`h-5 w-5 ${iconColorClass}`} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
          {description}
        </p>

        {trend && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
