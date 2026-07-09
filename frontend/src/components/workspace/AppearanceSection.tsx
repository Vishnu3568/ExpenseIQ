import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export const AppearanceSection: React.FC = () => {
  const { theme, updateTheme } = useWorkspace();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleThemeSelect = async (selectedTheme: string) => {
    setIsSubmitting(true);
    setSuccess(false);
    try {
      await updateTheme(selectedTheme);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to change theme:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header description */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Appearance settings</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Choose how ExpenseIQ looks to you. Select a light theme, dark theme, or sync with your system defaults.</p>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Light Theme */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleThemeSelect('light')}
          className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border text-center transition-all ${
            theme === 'light'
              ? 'border-indigo-600 bg-indigo-50/25 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400 ring-2 ring-indigo-550/10'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400'
          }`}
        >
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-900/30">
            <Sun className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">Light Mode</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Classic clean interface</span>
          </div>
        </button>

        {/* Dark Theme */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleThemeSelect('dark')}
          className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border text-center transition-all ${
            theme === 'dark'
              ? 'border-indigo-600 bg-indigo-50/25 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400 ring-2 ring-indigo-550/10'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400'
          }`}
        >
          <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/20 flex items-center justify-center text-violet-555 border border-violet-100 dark:border-violet-900/30">
            <Moon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">Dark Mode</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Sleek, low-light theme</span>
          </div>
        </button>

        {/* System Theme */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleThemeSelect('system')}
          className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border text-center transition-all ${
            theme === 'system'
              ? 'border-indigo-600 bg-indigo-50/25 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400 ring-2 ring-indigo-550/10'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400'
          }`}
        >
          <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950/20 flex items-center justify-center text-sky-500 border border-sky-100 dark:border-sky-900/30">
            <Monitor className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">System Default</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Syncs with OS preferences</span>
          </div>
        </button>
      </div>

      {/* Success alert message overlay */}
      {success && (
        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 text-center text-xs font-medium max-w-xs mx-auto animate-fade-in">
          Theme preferences applied successfully!
        </div>
      )}
    </div>
  );
};
export default AppearanceSection;
