import React from 'react';
import { Plus, Download, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface DashboardHeaderProps {
  userName?: string;
  onQuickAddClick: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'User',
  onQuickAddClick,
}) => {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
          <Calendar className="h-4 w-4 text-slate-400" />
          {formattedDate}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          disabled
          className="flex items-center gap-2 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>

        <Button
          onClick={onQuickAddClick}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>Quick Add</span>
        </Button>
      </div>
    </div>
  );
};
