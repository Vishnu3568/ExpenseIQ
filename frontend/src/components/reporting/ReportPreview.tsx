import React from 'react';
import { Eye, FileText, FileSpreadsheet, Globe } from 'lucide-react';
import { ReportDetails } from '../../types/report';

interface ReportPreviewProps {
  report: ReportDetails | null;
  onSave: () => void;
  onExport: (format: 'pdf' | 'csv' | 'excel' | 'html') => void;
  isSaving: boolean;
  currencySymbol?: string;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  onSave,
  onExport,
  isSaving,
  currencySymbol = '$',
}) => {
  if (!report) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-16 text-center shadow-sm h-full flex flex-col items-center justify-center text-slate-400">
        <Eye className="h-12 w-12 text-slate-350 dark:text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Report Preview Container</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1">
          Configure timing range parameters in the left panel and click Generate Preview to load details here.
        </p>
      </div>
    );
  }

  const s = report.summary;
  const t = report.template || 'professional';

  // Theme borders/accents styling
  let primaryBgColor = 'bg-indigo-600 dark:bg-indigo-500';
  let primaryBorderColor = 'border-indigo-500';
  let primaryTextColor = 'text-indigo-600 dark:text-indigo-400';
  let accentCardBg = 'bg-slate-50/50 dark:bg-slate-800/40';

  if (t === 'minimal') {
    primaryBgColor = 'bg-slate-800 dark:bg-slate-700';
    primaryBorderColor = 'border-slate-800 dark:border-slate-700';
    primaryTextColor = 'text-slate-800 dark:text-slate-300';
    accentCardBg = 'bg-slate-50/30 dark:bg-slate-900/50';
  } else if (t === 'executive') {
    primaryBgColor = 'bg-slate-950 dark:bg-slate-900';
    primaryBorderColor = 'border-slate-950 dark:border-slate-900';
    primaryTextColor = 'text-slate-900 dark:text-slate-100';
    accentCardBg = 'bg-amber-50/10 dark:bg-amber-950/5';
  }

  const formatCurrency = (val: number) => {
    return `${currencySymbol}${Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isSaved = !!report.id;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Exporter Controls Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Report Preview Dashboard
        </span>

        <div className="flex items-center gap-2">
          {!isSaved && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save to History'}
            </button>
          )}

          {isSaved ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onExport('pdf')}
                className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Download PDF format"
              >
                <FileText className="h-3.5 w-3.5 text-rose-500" />
                <span className="hidden md:inline">PDF</span>
              </button>
              <button
                onClick={() => onExport('excel')}
                className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Download Excel format"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                <span className="hidden md:inline">Excel</span>
              </button>
              <button
                onClick={() => onExport('csv')}
                className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Download CSV format"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden md:inline">CSV</span>
              </button>
              <button
                onClick={() => onExport('html')}
                className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Open Printable HTML layout"
              >
                <Globe className="h-3.5 w-3.5 text-indigo-500" />
                <span className="hidden md:inline">HTML</span>
              </button>
            </div>
          ) : (
            <span className="text-[10px] text-amber-500 font-semibold bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-lg">
              Save report first to enable download exports
            </span>
          )}
        </div>
      </div>

      {/* High-Fidelity Preview Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6 max-h-[680px]">
        {/* Template Header layout */}
        <div className={`p-5 rounded-2xl ${primaryBgColor} text-white flex flex-col justify-between h-32`}>
          <div>
            <h1 className="text-xl font-bold">{report.name}</h1>
            <p className="text-[11px] opacity-80 mt-1">ExpenseIQ Financial Statement Report Log</p>
          </div>
          <div className="flex justify-between items-end border-t border-white/10 pt-2 text-[10px] opacity-90">
            <span>Owner: {report.userName}</span>
            <span>Generated: {new Date(report.generatedAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Executive summary metrics */}
        <div>
          <h2 className={`text-xs font-bold uppercase tracking-wider ${primaryTextColor} mb-3`}>
            Executive summary metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={`p-4 border-t-2 ${primaryBorderColor} rounded-xl ${accentCardBg}`}>
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Total Income</span>
              <p className="text-lg font-bold text-slate-850 dark:text-white mt-1">{formatCurrency(s.totalIncome)}</p>
            </div>

            <div className={`p-4 border-t-2 ${primaryBorderColor} rounded-xl ${accentCardBg}`}>
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Total Expense</span>
              <p className="text-lg font-bold text-slate-850 dark:text-white mt-1">{formatCurrency(s.totalExpense)}</p>
            </div>

            <div className={`p-4 border-t-2 ${s.netBalance >= 0 ? 'border-emerald-500' : 'border-rose-500'} rounded-xl ${s.netBalance >= 0 ? 'bg-emerald-50/20 dark:bg-emerald-950/5' : 'bg-rose-50/20 dark:bg-rose-950/5'}`}>
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Net Balance</span>
              <p className={`text-lg font-bold mt-1 ${s.netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{formatCurrency(s.netBalance)}</p>
            </div>

            <div className={`p-4 border-t-2 ${primaryBorderColor} rounded-xl ${accentCardBg}`}>
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Savings Rate</span>
              <p className="text-lg font-bold text-slate-850 dark:text-white mt-1">{s.savingsRate.toFixed(1)}%</p>
            </div>

            <div className={`p-4 border-t-2 ${primaryBorderColor} rounded-xl ${accentCardBg}`}>
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Daily Avg Spend</span>
              <p className="text-lg font-bold text-slate-850 dark:text-white mt-1">{formatCurrency(s.averageDailySpend)}</p>
            </div>

            <div className={`p-4 border-t-2 ${s.budgetUtilization > 100 ? 'border-rose-500' : primaryBorderColor} rounded-xl ${s.budgetUtilization > 100 ? 'bg-rose-50/20 dark:bg-rose-950/5' : accentCardBg}`}>
              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Budget Utilization</span>
              <p className={`text-lg font-bold mt-1 ${s.budgetUtilization > 100 ? 'text-rose-500' : 'text-slate-850 dark:text-white'}`}>{s.budgetUtilization.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown distribution chart bars */}
        {report.categoryBreakdown.length > 0 && (
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${primaryTextColor} mb-3`}>
              Category breakdown distribution
            </h2>
            <div className="space-y-4 bg-slate-50/30 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-2xl p-4">
              {report.categoryBreakdown.slice(0, 5).map((cat) => (
                <div key={cat.id || cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{cat.name}</span>
                    <span className="text-slate-500 dark:text-slate-450">
                      {formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  {/* Progress slide line */}
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: cat.color || '#4F46E5',
                        width: `${cat.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Transaction table */}
        <div>
          <h2 className={`text-xs font-bold uppercase tracking-wider ${primaryTextColor} mb-3`}>
            Detailed Transactions Log ({report.transactions.length})
          </h2>
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 text-slate-550 dark:text-slate-400 font-semibold">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Title Description</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {report.transactions.slice(0, 8).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/20">
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-750 dark:text-slate-200">
                      {tx.title}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      {tx.categoryName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      {tx.type}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-755 dark:text-slate-200'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.transactions.length > 8 && (
              <div className="p-3 bg-slate-50/30 dark:bg-slate-900/50 text-center text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/50">
                Displaying first 8 transactions in preview page. PDF exports will contain full log list.
              </div>
            )}
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="text-center text-[10px] text-slate-400 pt-5 border-t border-slate-100 dark:border-slate-850">
          ExpenseIQ Financial Statement Report Engine • Document Version {report.version}
        </div>
      </div>
    </div>
  );
};
export default ReportPreview;
