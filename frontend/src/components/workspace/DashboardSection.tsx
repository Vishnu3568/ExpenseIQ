import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Layout, CheckSquare, Eye, Sliders } from 'lucide-react';
import { Button } from '../ui/Button';

export const DashboardSection: React.FC = () => {
  const { dashboard, updateDashboard } = useWorkspace();
  const [landingPage, setLandingPage] = useState(dashboard?.defaultLandingPage || '/dashboard');
  const [compactMode, setCompactMode] = useState(dashboard?.compactMode || false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(dashboard?.sidebarCollapsed || false);
  const [chartAnimations, setChartAnimations] = useState(dashboard?.chartAnimations || true);
  const [density, setDensity] = useState<'COMFORTABLE' | 'COMPACT' | 'SPACIOUS'>(dashboard?.density || 'COMFORTABLE');
  const [favorites, setFavorites] = useState<string[]>(dashboard?.favoriteWidgets || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const availableWidgets = [
    { id: 'net-worth', label: 'Net Worth Summary' },
    { id: 'monthly-budget', label: 'Monthly Budget Limits Tracker' },
    { id: 'cash-flow-chart', label: 'Cash Flow Line Charts' },
    { id: 'recent-activity', label: 'Recent Transactions List' },
  ];

  const handleWidgetToggle = (widgetId: string) => {
    setFavorites((prev) =>
      prev.includes(widgetId) ? prev.filter((id) => id !== widgetId) : [...prev, widgetId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await updateDashboard({
        defaultLandingPage: landingPage,
        favoriteWidgets: favorites,
        compactMode,
        sidebarCollapsed,
        chartAnimations,
        density,
      });
      setStatusMsg({ type: 'success', text: 'Dashboard preferences saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to update preferences' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!dashboard) {
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
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Dashboard Customization</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure default widgets, page densities, and sidebars parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Default Landing Page */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Layout className="h-3.5 w-3.5" /> Default Landing Route
          </label>
          <select
            value={landingPage}
            onChange={(e) => setLandingPage(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="/dashboard">Executive Dashboard</option>
            <option value="/transactions">Transaction Ledger</option>
            <option value="/budgets">Budgets Management</option>
            <option value="/reports">Financial Reports</option>
            <option value="/intelligence">Data Intelligence</option>
          </select>
        </div>

        {/* Display Density */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5" /> Table & List Density
          </label>
          <select
            value={density}
            onChange={(e) => setDensity(e.target.value as 'COMFORTABLE' | 'COMPACT' | 'SPACIOUS')}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="COMFORTABLE">Comfortable (Generous spacing)</option>
            <option value="COMPACT">Compact (Tight grid rows)</option>
            <option value="SPACIOUS">Spacious (Large spacing limits)</option>
          </select>
        </div>

        {/* Favorite Dashboard Widgets */}
        <div className="space-y-3 md:col-span-2">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <CheckSquare className="h-3.5 w-3.5" /> Favorite Dashboard Widgets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableWidgets.map((widget) => (
              <label
                key={widget.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={favorites.includes(widget.id)}
                  onChange={() => handleWidgetToggle(widget.id)}
                  className="rounded border-slate-200 dark:border-slate-850 text-indigo-650"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {widget.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Toggles Checkboxes Grid */}
        <div className="space-y-3 md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" /> Display Toggles
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(e) => setCompactMode(e.target.checked)}
                className="rounded border-slate-200 dark:border-slate-850 text-indigo-650"
              />
              <span className="text-xs text-slate-700 dark:text-slate-350">Enable Compact UI</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sidebarCollapsed}
                onChange={(e) => setSidebarCollapsed(e.target.checked)}
                className="rounded border-slate-200 dark:border-slate-850 text-indigo-650"
              />
              <span className="text-xs text-slate-700 dark:text-slate-350">Default Sidebar Collapsed</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={chartAnimations}
                onChange={(e) => setChartAnimations(e.target.checked)}
                className="rounded border-slate-200 dark:border-slate-850 text-indigo-650"
              />
              <span className="text-xs text-slate-700 dark:text-slate-350">Enable Chart Animations</span>
            </label>
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {statusMsg && (
        <div className={`p-3 rounded-lg text-xs font-medium ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'}`}>
          {statusMsg.text}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} variant="primary">
          Save Settings
        </Button>
      </div>
    </form>
  );
};
export default DashboardSection;
