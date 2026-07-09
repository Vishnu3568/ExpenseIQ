import React, { useState } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { ComparisonMode, ComparisonResult } from '../../types/intelligence';

interface ComparisonPanelProps {
  categories: { id: string; name: string }[];
  budgets: { id: string; name: string }[];
  comparisonResult: ComparisonResult | null;
  onCompare: (payload: { mode: ComparisonMode; params: Record<string, unknown> }) => void;
  onClear: () => void;
  isLoading: boolean;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  categories,
  budgets,
  comparisonResult,
  onCompare,
  onClear,
  isLoading,
}) => {
  const [mode, setMode] = useState<ComparisonMode>('MONTH_VS_MONTH');

  // Input states
  const [pStart, setPStart] = useState('');
  const [pEnd, setPEnd] = useState('');
  const [cStart, setCStart] = useState('');
  const [cEnd, setCEnd] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: { mode: ComparisonMode; params: Record<string, unknown> } = { mode, params: {} };

    if (mode === 'MONTH_VS_MONTH' || mode === 'YEAR_VS_YEAR') {
      if (!pStart || !pEnd || !cStart || !cEnd) return;
      payload.params.primaryPeriod = { start: new Date(pStart).toISOString(), end: new Date(pEnd).toISOString() };
      payload.params.comparisonPeriod = { start: new Date(cStart).toISOString(), end: new Date(cEnd).toISOString() };
    } else if (mode === 'CATEGORY_VS_CATEGORY') {
      if (selectedCats.length === 0) return;
      payload.params.categoryIds = selectedCats;
      if (pStart && pEnd) {
        payload.params.primaryPeriod = { start: new Date(pStart).toISOString(), end: new Date(pEnd).toISOString() };
      }
    } else if (mode === 'INCOME_VS_EXPENSE') {
      if (pStart && pEnd) {
        payload.params.primaryPeriod = { start: new Date(pStart).toISOString(), end: new Date(pEnd).toISOString() };
      }
    } else if (mode === 'BUDGET_VS_ACTUAL') {
      if (!selectedBudget) return;
      payload.params.budgetId = selectedBudget;
    }

    onCompare(payload);
  };

  const handleCatCheckboxChange = (catId: string) => {
    setSelectedCats((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/50 pb-3 justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-indigo-500" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Comparative Analytics</h2>
        </div>
        {comparisonResult && (
          <button
            onClick={onClear}
            className="text-[10px] text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Clear Comparison
          </button>
        )}
      </div>

      {!comparisonResult ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
              Comparison Category Mode
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-white focus:outline-none"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as ComparisonMode);
                onClear();
              }}
            >
              <option value="MONTH_VS_MONTH">Month vs Month Period</option>
              <option value="YEAR_VS_YEAR">Year vs Year Period</option>
              <option value="CATEGORY_VS_CATEGORY">Category vs Category Distribution</option>
              <option value="INCOME_VS_EXPENSE">Inflow vs Outflow</option>
              <option value="BUDGET_VS_ACTUAL">Budget limits vs Actual Expenses</option>
            </select>
          </div>

          {/* Conditional inputs */}
          {(mode === 'MONTH_VS_MONTH' || mode === 'YEAR_VS_YEAR') && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Primary Start</label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                    value={pStart}
                    onChange={(e) => setPStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Primary End</label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                    value={pEnd}
                    onChange={(e) => setPEnd(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Comparison Start</label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                    value={cStart}
                    onChange={(e) => setCStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Comparison End</label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                    value={cEnd}
                    onChange={(e) => setCEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {mode === 'CATEGORY_VS_CATEGORY' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Timing Start</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                    value={pStart}
                    onChange={(e) => setPStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Timing End</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                    value={pEnd}
                    onChange={(e) => setPEnd(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-2">Select Categories to Compare</label>
                <div className="max-h-[120px] overflow-y-auto space-y-1.5 border border-slate-100 dark:border-slate-800 p-2 rounded-xl">
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCats.includes(c.id)}
                        onChange={() => handleCatCheckboxChange(c.id)}
                        className="rounded border-slate-200 text-indigo-650"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === 'INCOME_VS_EXPENSE' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                  value={pStart}
                  onChange={(e) => setPStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-white"
                  value={pEnd}
                  onChange={(e) => setPEnd(e.target.value)}
                />
              </div>
            </div>
          )}

          {mode === 'BUDGET_VS_ACTUAL' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-2">Target Budget</label>
              <select
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-white focus:outline-none"
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
              >
                <option value="">Select budget...</option>
                {budgets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Execute Comparison</span>}
          </button>
        </form>
      ) : (
        /* Result Rendering */
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {comparisonResult.metrics.map((metric, idx) => {
              const pct = metric.percentageChange;
              const isPositiveChange = pct >= 0;

              return (
                <div key={idx} className="bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                    {metric.label}
                  </span>
                  <div className="flex items-baseline justify-between gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-850 dark:text-white">
                      ${metric.primaryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>

                    {/* Change Pill */}
                    <div className={`flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isPositiveChange
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450'
                    }`}>
                      {isPositiveChange ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      <span>{Math.abs(pct).toFixed(1)}%</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">
                    Previous: ${metric.comparisonValue.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Details Table view */}
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="py-2 px-3">Parameters</th>
                  <th className="py-2 px-3 text-right">Primary</th>
                  <th className="py-2 px-3 text-right">Compared</th>
                  <th className="py-2 px-3 text-right">Delta (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {comparisonResult.tableData.map((row, idx) => {
                  const r = row as Record<string, string | number | boolean | undefined>;
                  const label = r.metric || r.categoryName || r.type || r.budgetName || `Item ${idx + 1}`;
                  const pVal = r.currentPeriod !== undefined ? r.currentPeriod : r.amountSpent !== undefined ? r.amountSpent : r.amount !== undefined ? r.amount : r.actualSpend;
                  const cVal = r.previousPeriod !== undefined ? r.previousPeriod : r.shareOfTotalPercent !== undefined ? r.shareOfTotalPercent : r.percentage !== undefined ? r.percentage : r.limitAmount;
                  const delta = r.deltaPercent !== undefined ? r.deltaPercent : r.shareOfTotalPercent !== undefined ? r.shareOfTotalPercent : r.utilizationRatePercent;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                      <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-350">{label}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-800 dark:text-white">
                        ${Number(pVal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 dark:text-slate-400">
                        {r.shareOfTotalPercent !== undefined || r.percentage !== undefined
                          ? `${Number(cVal as number).toFixed(1)}%`
                          : `$${Number(cVal || 0).toLocaleString()}`}
                      </td>
                      <td className={`py-2 px-3 text-right font-semibold ${(delta as number) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {(delta as number) >= 0 ? '+' : ''}{Number(delta || 0).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default ComparisonPanel;
