import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Check, ExternalLink, Inbox } from 'lucide-react';
import { NotificationItem } from '../../types/notification';

export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const {
    unreadCount,
    markAsRead,
    markAllRead,
    fetchNotifications,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [latestUnread, setLatestUnread] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch the latest 5 unread notifications for preview
  const loadUnreadPreview = useCallback(async () => {
    try {
      const data = await fetchNotifications({ status: 'UNREAD', page: 1, limit: 5 });
      setLatestUnread(data.items);
    } catch (err) {
      console.error('Failed to load unread preview:', err);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    if (isOpen) {
      loadUnreadPreview();
    }
  }, [isOpen, unreadCount, loadUnreadPreview]);

  // Click outside to close handler
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Escape key closes the dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleItemClick = async (id: string, actionUrl?: string) => {
    await markAsRead(id);
    setIsOpen(false);
    if (actionUrl) {
      navigate(actionUrl);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-85 transition-opacity relative"
        aria-label={`View Notifications, ${unreadCount} unread`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white ring-2 ring-background">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold">Unread Alerts</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List items */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/40">
            {latestUnread.length === 0 ? (
              <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
                <Inbox className="h-6 w-6 text-slate-350 dark:text-slate-650" />
                <span className="text-[11px] font-semibold text-slate-400">All caught up!</span>
              </div>
            ) : (
              latestUnread.map((item) => (
                <div
                  key={item.id}
                  className="p-3 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  {/* Circle priority dot */}
                  <span
                    className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                      item.priority === 'CRITICAL'
                        ? 'bg-rose-600'
                        : item.priority === 'HIGH'
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold truncate text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.message}
                    </p>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    {item.actionUrl && (
                      <button
                        type="button"
                        onClick={() => handleItemClick(item.id, item.actionUrl)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 transition-colors"
                        title="View action details"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer link */}
          <div className="border-t border-slate-100 dark:border-slate-800 py-1.5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
