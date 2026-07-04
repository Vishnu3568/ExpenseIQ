import React, { useState } from 'react';
import { Calendar, Trash2, Download, Eye, FileSpreadsheet, FileText, Globe } from 'lucide-react';
import { ReportHistoryItem } from '../../types/report';

interface ReportHistoryListProps {
  history: ReportHistoryItem[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string, format: 'pdf' | 'csv' | 'excel' | 'html') => void;
  isLoading: boolean;
}

export const ReportHistoryList: React.FC<ReportHistoryListProps> = ({
  history,
  onView,
  onDelete,
  onExport,
  isLoading,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (isLoading && history.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-450 dark:text-slate-550">
        <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-350" />
        <h3 className="text-sm font-bold">No Report History Found</h3>
        <p className="text-xs text-slate-400 mt-1">
          Save generated report templates to keep a shortcut history list.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/50 pb-3 mb-2">
        <Calendar className="h-5 w-5 text-indigo-500" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">Generated Report History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
              <th className="py-2.5 px-3">Report Name</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Generated Date</th>
              <th className="py-2.5 px-3">Template</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-750 dark:text-slate-200">
                  {item.name}
                </td>
                <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                  {item.type.replace(/_/g, ' ')}
                </td>
                <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                  {new Date(item.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </td>
                <td className="py-3 px-3 capitalize text-slate-500 dark:text-slate-400">
                  {item.template}
                </td>
                <td className="py-3 px-3 text-right relative">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(item.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="Load live preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* Export Format Dropdown wrapper */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Download / Export"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      {activeDropdown === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-20 text-left">
                            <button
                              onClick={() => {
                                onExport(item.id, 'pdf');
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5 text-rose-500" />
                              <span>Export PDF</span>
                            </button>
                            <button
                              onClick={() => {
                                onExport(item.id, 'excel');
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
                            >
                              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Export Excel</span>
                            </button>
                            <button
                              onClick={() => {
                                onExport(item.id, 'csv');
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
                            >
                              <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
                              <span>Export CSV</span>
                            </button>
                            <button
                              onClick={() => {
                                onExport(item.id, 'html');
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
                            >
                              <Globe className="h-3.5 w-3.5 text-indigo-500" />
                              <span>Printable HTML</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ReportHistoryList;
