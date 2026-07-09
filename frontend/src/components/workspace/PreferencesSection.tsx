import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Globe, DollarSign, Clock, Hash, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

export const PreferencesSection: React.FC = () => {
  const { preferences, updatePreferences } = useWorkspace();
  const [currency, setCurrency] = useState(preferences?.currency || 'USD');
  const [timezone, setTimezone] = useState(preferences?.timezone || 'UTC');
  const [locale, setLocale] = useState(preferences?.locale || 'en-US');
  const [numberFormat, setNumberFormat] = useState(preferences?.numberFormat || 'COMMA');
  const [dateFormat, setDateFormat] = useState(preferences?.dateFormat || 'YYYY-MM-DD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await updatePreferences({
        currency,
        timezone,
        locale,
        numberFormat,
        dateFormat,
      });
      setStatusMsg({ type: 'success', text: 'Regional preferences saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to update preferences' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!preferences) {
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
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Regional Settings</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure currency formats, locales, timezones, and display formats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Currency selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" /> Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="INR">INR (₹) - Indian Rupee</option>
            <option value="JPY">JPY (¥) - Japanese Yen</option>
          </select>
        </div>

        {/* Timezone selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="UTC">UTC (Universal Coordinated Time)</option>
            <option value="America/New_York">America/New York (EST/EDT)</option>
            <option value="Europe/London">Europe/London (GMT/BST)</option>
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
          </select>
        </div>

        {/* Locale selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Locale / Language Pack
          </label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="en-US">English (United States) - en-US</option>
            <option value="en-GB">English (United Kingdom) - en-GB</option>
            <option value="hi-IN">Hindi (India) - hi-IN</option>
            <option value="ja-JP">Japanese (Japan) - ja-JP</option>
          </select>
        </div>

        {/* Number Format selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5" /> Number Format
          </label>
          <select
            value={numberFormat}
            onChange={(e) => setNumberFormat(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="COMMA">1,234.56 (Comma separated)</option>
            <option value="DOT">1.234,56 (Period separated)</option>
            <option value="SPACE">1 234,56 (Space separated)</option>
          </select>
        </div>

        {/* Date Format selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Date Format
          </label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-08)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (08/07/2026)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (07/08/2026)</option>
          </select>
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
export default PreferencesSection;
