import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Bell, Mail, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';

export const NotificationsSection: React.FC = () => {
  const { notifications, updateNotifications } = useWorkspace();
  const [budgetAlerts, setBudgetAlerts] = useState(notifications?.budgetAlerts ?? true);
  const [weeklySummary, setWeeklySummary] = useState(notifications?.weeklySummary ?? true);
  const [monthlySummary, setMonthlySummary] = useState(notifications?.monthlySummary ?? true);
  const [securityAlerts, setSecurityAlerts] = useState(notifications?.securityAlerts ?? true);
  const [productAnnouncements, setProductAnnouncements] = useState(notifications?.productAnnouncements ?? false);
  const [emailNotifications, setEmailNotifications] = useState(notifications?.emailNotifications ?? true);
  const [pushNotifications, setPushNotifications] = useState(notifications?.pushNotifications ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await updateNotifications({
        budgetAlerts,
        weeklySummary,
        monthlySummary,
        securityAlerts,
        productAnnouncements,
        emailNotifications,
        pushNotifications,
      });
      setStatusMsg({ type: 'success', text: 'Notification preferences saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to update preferences' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!notifications) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header description */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Notification Preferences</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure alert rules and delivery channels for notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts and Summaries */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Bell className="h-3.5 w-3.5" /> Alert Categories
          </h4>
          
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer">
            <input
              type="checkbox"
              checked={budgetAlerts}
              onChange={(e) => setBudgetAlerts(e.target.checked)}
              className="rounded border-slate-200 dark:border-slate-855 text-indigo-650 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Budget Limit Notifications</span>
              <span className="text-[10px] text-slate-400">Receive alerts when nearing or exceeding category budgets.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer">
            <input
              type="checkbox"
              checked={weeklySummary}
              onChange={(e) => setWeeklySummary(e.target.checked)}
              className="rounded border-slate-200 dark:border-slate-855 text-indigo-650 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Weekly Highlights Report</span>
              <span className="text-[10px] text-slate-400">A short summary of weekly transaction tallies and savings.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer">
            <input
              type="checkbox"
              checked={monthlySummary}
              onChange={(e) => setMonthlySummary(e.target.checked)}
              className="rounded border-slate-200 dark:border-slate-855 text-indigo-650 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Monthly Statements Digests</span>
              <span className="text-[10px] text-slate-400">Deep-dive financial breakdown report compiled every month.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer">
            <input
              type="checkbox"
              checked={securityAlerts}
              onChange={(e) => setSecurityAlerts(e.target.checked)}
              className="rounded border-slate-200 dark:border-slate-855 text-indigo-650 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Security & Access Flags</span>
              <span className="text-[10px] text-slate-400">Notification of password changes, email shifts, or logins.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer">
            <input
              type="checkbox"
              checked={productAnnouncements}
              onChange={(e) => setProductAnnouncements(e.target.checked)}
              className="rounded border-slate-200 dark:border-slate-855 text-indigo-650 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Announcements</span>
              <span className="text-[10px] text-slate-400">Info on new system options, releases, or improvements.</span>
            </div>
          </label>
        </div>

        {/* Delivery Channels */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            Delivery Channels
          </h4>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="rounded border-slate-200 dark:border-slate-855 text-indigo-650 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-650" /> Email Notifications
              </span>
              <span className="text-[10px] text-slate-400">Send alerts directly to your registered inbox.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
              className="rounded border-slate-200 dark:border-slate-855 text-indigo-650 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-indigo-650" /> Push Notifications
              </span>
              <span className="text-[10px] text-slate-400">Deliver in-app push alerts directly on dashboard.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Status Alerts */}
      {statusMsg && (
        <div className={`p-3 rounded-lg text-xs font-medium ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'}`}>
          {statusMsg.text}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} variant="primary">
          Save Preferences
        </Button>
      </div>
    </form>
  );
};
export default NotificationsSection;
