import React, { useEffect, useState, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { ActivityEventItem } from '../types/notification';
import {
  History,
  CreditCard,
  AlertTriangle,
  FolderTree,
  FileText,
  Compass,
  Sliders,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ActivityTimeline: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEventItem[]>([]);
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.getActivities({
        module: moduleFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page: currentPage,
        limit: 15,
      });

      if (res.success) {
        setActivities(res.data.items);
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalCount(res.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to load activity timeline events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [moduleFilter, startDate, endDate, currentPage]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getModuleIcon = (moduleName: string) => {
    switch (moduleName) {
      case 'TRANSACTION':
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'BUDGET':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'CATEGORY':
        return <FolderTree className="h-4 w-4 text-indigo-500" />;
      case 'REPORT':
        return <FileText className="h-4 w-4 text-violet-500" />;
      case 'INTELLIGENCE':
        return <Compass className="h-4 w-4 text-sky-500" />;
      default:
        return <Sliders className="h-4 w-4 text-slate-450" />;
    }
  };

  // Group events into Today, Yesterday, and Earlier
  const getGroupedActivities = () => {
    const today: ActivityEventItem[] = [];
    const yesterday: ActivityEventItem[] = [];
    const earlier: ActivityEventItem[] = [];

    const now = new Date();
    const todayStr = now.toDateString();

    const yest = new Date();
    yest.setDate(now.getDate() - 1);
    const yestStr = yest.toDateString();

    activities.forEach((item) => {
      const date = new Date(item.createdAt);
      const dateStr = date.toDateString();

      if (dateStr === todayStr) {
        today.push(item);
      } else if (dateStr === yestStr) {
        yesterday.push(item);
      } else {
        earlier.push(item);
      }
    });

    return { today, yesterday, earlier };
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      dateStyle: 'medium',
    });
  };

  const { today, yesterday, earlier } = getGroupedActivities();
  const hasItems = activities.length > 0;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="h-5 w-5 text-indigo-650" /> Activity Timeline
        </h1>
        <p className="text-xs text-slate-550 dark:text-slate-400">
          Chronological history of operations and adjustments on your portfolios.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-slate-50/40 dark:bg-slate-900/10 border border-slate-150 dark:border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Module Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
            <Sliders className="h-3 w-3" /> Module Category
          </label>
          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="TRANSACTION">Transactions Ledger</option>
            <option value="BUDGET">Budgets & Limits</option>
            <option value="CATEGORY">Category Configuration</option>
            <option value="REPORT">Financial Reports</option>
            <option value="INTELLIGENCE">Saved Views & Diagnostics</option>
            <option value="WORKSPACE">Workspace Configurations</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="h-3 w-3" /> End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Timeline List feed */}
      <div className="relative border-l border-slate-100 dark:border-slate-800 ml-4 pl-6 space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-16 bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !hasItems ? (
          <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col items-center justify-center gap-3 -ml-10">
            <Info className="h-8 w-8 text-slate-300 dark:text-slate-700" />
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">No activity logged</span>
              <p className="text-xs text-slate-400">Try modifying your category filters or date thresholds parameters.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Today Group */}
            {today.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 -ml-10 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-655" /> Today
                </h3>
                {today.map((item) => (
                  <ActivityItemRow key={item.id} item={item} getModuleIcon={getModuleIcon} formatTime={formatTime} />
                ))}
              </div>
            )}

            {/* Yesterday Group */}
            {yesterday.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 -ml-10 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400" /> Yesterday
                </h3>
                {yesterday.map((item) => (
                  <ActivityItemRow key={item.id} item={item} getModuleIcon={getModuleIcon} formatTime={formatTime} />
                ))}
              </div>
            )}

            {/* Earlier Group */}
            {earlier.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 -ml-10 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-300" /> Earlier
                </h3>
                {earlier.map((item) => (
                  <ActivityItemRow
                    key={item.id}
                    item={item}
                    getModuleIcon={getModuleIcon}
                    formatTime={(timeStr) => `${formatFullDate(timeStr)} ${formatTime(timeStr)}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <span className="text-[11px] text-slate-400">
            Showing page {currentPage} of {totalPages} ({totalCount} total activities)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ActivityRowProps {
  item: ActivityEventItem;
  getModuleIcon: (modName: string) => React.ReactNode;
  formatTime: (dateStr: string) => string;
}

const ActivityItemRow: React.FC<ActivityRowProps> = ({ item, getModuleIcon, formatTime }) => {
  return (
    <div className="relative group flex items-start gap-4">
      {/* Node Bullet Circle */}
      <span className="absolute -left-[30px] top-2 flex items-center justify-center h-4 w-4 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 group-hover:border-indigo-500 transition-colors" />

      {/* Content wrapper */}
      <div className="flex-1 p-4 border border-slate-100 dark:border-slate-850 bg-white/50 dark:bg-slate-900/10 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border shrink-0">
            {getModuleIcon(item.module)}
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.title}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{item.description}</p>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTime(item.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ActivityTimeline;
