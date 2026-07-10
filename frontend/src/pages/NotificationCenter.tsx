import React, { useEffect, useState, useCallback } from 'react';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  Check,
  CheckSquare,
  Archive,
  Trash2,
  AlertTriangle,
  Shield,
  FileText,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Clock,
  ArchiveRestore,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { NotificationItem } from '../types/notification';

type FilterTab = 'ALL' | 'UNREAD' | 'FINANCIAL' | 'BUDGET' | 'REPORTS' | 'SECURITY' | 'ARCHIVED';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    archiveNotification,
    markAllRead,
    archiveAllRead,
    deleteNotification,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<FilterTab>('UNREAD');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Summary counts metrics states
  const [stats, setStats] = useState({
    unread: 0,
    critical: 0,
    budgets: 0,
    security: 0,
  });

  // Modal deletion confirmation states
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      const filters: Record<string, unknown> = {
        page: currentPage,
        limit: 10,
      };

      // Tab mapping to API queries
      if (activeTab === 'UNREAD') {
        filters.status = 'UNREAD';
      } else if (activeTab === 'ARCHIVED') {
        filters.status = 'ARCHIVED';
      } else {
        // For operational tabs, we query all non-archived unless specified
        filters.status = 'UNREAD'; // Default tab focuses on unread
      }

      if (activeTab === 'FINANCIAL') {
        filters.type = 'LARGE_TRANSACTION';
        filters.status = undefined; // Show both read and unread
      } else if (activeTab === 'BUDGET') {
        filters.type = undefined;
        filters.status = undefined;
        // Rules engine handles both warning and exceeded
      } else if (activeTab === 'REPORTS') {
        filters.type = 'REPORT_GENERATED';
        filters.status = undefined;
      } else if (activeTab === 'SECURITY') {
        filters.type = 'SECURITY_ALERT';
        filters.status = undefined;
      }

      const res = await fetchNotifications(filters);
      
      setTotalPages(res.pagination.totalPages || 1);
      setTotalCount(res.pagination.total);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, [activeTab, currentPage, fetchNotifications]);

  const loadMetrics = useCallback(async () => {
    try {
      const [unreadRes, criticalRes, budgetRes, securityRes] = await Promise.all([
        fetchNotifications({ status: 'UNREAD', limit: 1 }),
        fetchNotifications({ priority: 'CRITICAL', limit: 1 }),
        fetchNotifications({ type: 'BUDGET_EXCEEDED', limit: 1 }),
        fetchNotifications({ type: 'SECURITY_ALERT', limit: 1 }),
      ]);
      setStats({
        unread: unreadRes.pagination.total,
        critical: criticalRes.pagination.total,
        budgets: budgetRes.pagination.total,
        security: securityRes.pagination.total,
      });
    } catch (err) {
      console.error('Failed to load notification summary stats:', err);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications, unreadCount]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics, unreadCount]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteNotification(deleteTargetId);
      setDeleteTargetId(null);
      loadNotifications();
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
      case 'NORMAL':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400 border-slate-100 dark:border-slate-850';
    }
  };

  const getEventIcon = (type: string) => {
    if (type === 'LARGE_TRANSACTION') return <CreditCard className="h-4 w-4 text-emerald-500" />;
    if (type.startsWith('BUDGET_')) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    if (type.startsWith('REPORT_')) return <FileText className="h-4 w-4 text-indigo-500" />;
    if (type === 'SECURITY_ALERT') return <Shield className="h-4 w-4 text-rose-500" />;
    return <Bell className="h-4 w-4 text-slate-400" />;
  };

  const formatFullTimestamp = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const displayedNotifications = activeTab === 'BUDGET'
    ? notifications.filter((n) => n.type === 'BUDGET_WARNING' || n.type === 'BUDGET_EXCEEDED')
    : notifications;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-650" /> Notification Center
          </h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
            Stay informed about your balance, warning thresholds, and security operations.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button size="sm" variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckSquare className="h-3.5 w-3.5 mr-1.5" /> Mark All Read
          </Button>
          <Button size="sm" variant="outline" onClick={archiveAllRead}>
            <Archive className="h-3.5 w-3.5 mr-1.5" /> Archive All Read
          </Button>
        </div>
      </div>

      {/* Summary metrics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unread Alerts</span>
          <span className="text-2xl font-bold mt-1 block">{stats.unread}</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-rose-500">Critical Actions</span>
          <span className="text-2xl font-bold mt-1 block text-rose-600 dark:text-rose-400">{stats.critical}</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exceeded Budgets</span>
          <span className="text-2xl font-bold mt-1 block">{stats.budgets}</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Warnings</span>
          <span className="text-2xl font-bold mt-1 block">{stats.security}</span>
        </div>
      </div>

      {/* Tabs list filters */}
      <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-800/80 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none gap-2">
        {(['UNREAD', 'ALL', 'FINANCIAL', 'BUDGET', 'REPORTS', 'SECURITY', 'ARCHIVED'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`py-2 px-3 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-650 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3">
            <Info className="h-8 w-8 text-slate-300 dark:text-slate-700" />
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">No notifications found</span>
              <p className="text-xs text-slate-400">All caught up! New events alerts will list here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedNotifications.map((item: NotificationItem) => (
              <div
                key={item.id}
                className={`p-4 border rounded-2xl bg-white dark:bg-slate-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  item.status === 'UNREAD'
                    ? 'border-indigo-100 dark:border-indigo-950/20 shadow-sm ring-1 ring-indigo-50/50 dark:ring-indigo-950/5'
                    : 'border-slate-100 dark:border-slate-800/80 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Category event icon */}
                  <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-150 dark:border-slate-800 shrink-0">
                    {getEventIcon(item.type)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      {/* Priority tag */}
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold border ${getPriorityStyle(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1.5" title={formatFullTimestamp(item.createdAt)}>
                      <Clock className="h-3 w-3" />
                      {formatFullTimestamp(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions widgets */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-50 dark:border-slate-800 pt-2 sm:pt-0 shrink-0">
                  {item.actionUrl && (
                    <a
                      href={item.actionUrl}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                    >
                      <ExternalLink className="h-3 w-3" /> View Details
                    </a>
                  )}

                  {item.status === 'UNREAD' ? (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border text-slate-655 dark:text-slate-300 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markAsUnread(item.id)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border text-slate-655 dark:text-slate-300 transition-colors"
                      title="Mark as unread"
                    >
                      <ArchiveRestore className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {item.status !== 'ARCHIVED' && (
                    <button
                      type="button"
                      onClick={() => archiveNotification(item.id)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border text-slate-655 dark:text-slate-300 transition-colors"
                      title="Archive alert"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-2 rounded-lg bg-rose-50/50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-100/50 dark:border-rose-950/30 text-rose-600 dark:text-rose-455 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <span className="text-[11px] text-slate-400">
            Showing page {currentPage} of {totalPages} ({totalCount} total alerts)
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

      {/* Modal deletion confirmation */}
      <Modal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title="Delete Notification Warning">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to permanently delete this notification alert? This action cannot be reversed.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationCenter;
