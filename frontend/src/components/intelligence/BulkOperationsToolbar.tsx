import React, { useState } from 'react';
import { Trash2, FileSpreadsheet, FolderClosed, ShieldAlert, X } from 'lucide-react';

interface BulkOperationsToolbarProps {
  selectedIds: string[];
  categories: { id: string; name: string; type: string }[];
  onAction: (
    action: 'DELETE' | 'EXPORT' | 'CATEGORY' | 'ARCHIVE' | 'RESTORE',
    categoryId?: string
  ) => Promise<void>;
  onClearSelection: () => void;
  isLoading: boolean;
}

export const BulkOperationsToolbar: React.FC<BulkOperationsToolbarProps> = ({
  selectedIds,
  categories,
  onAction,
  onClearSelection,
  isLoading,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetAction, setTargetAction] = useState<'DELETE' | 'ARCHIVE' | 'RESTORE' | null>(null);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [showCatSelect, setShowCatSelect] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleActionClick = (action: 'DELETE' | 'ARCHIVE' | 'RESTORE') => {
    setTargetAction(action);
    setShowConfirm(true);
  };

  const handleConfirmAction = async () => {
    if (!targetAction) return;
    await onAction(targetAction);
    setShowConfirm(false);
    setTargetAction(null);
  };

  const handleCategorySubmit = async () => {
    if (!selectedCatId) return;
    await onAction('CATEGORY', selectedCatId);
    setShowCatSelect(false);
    setSelectedCatId('');
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-40 border border-slate-800 animate-slide-up flex-wrap md:flex-nowrap">
        <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
          <span className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">
            {selectedIds.length}
          </span>
          <span className="text-xs font-semibold text-slate-300">Selected</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Change category trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCatSelect(!showCatSelect);
                setShowConfirm(false);
              }}
              disabled={isLoading}
              className="h-8 px-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <FolderClosed className="h-3.5 w-3.5" />
              <span>Change Category</span>
            </button>

            {showCatSelect && (
              <div className="absolute bottom-10 left-0 bg-slate-950 border border-slate-800 rounded-xl p-3 w-56 shadow-xl space-y-2.5 z-50 text-left">
                <label className="block text-[10px] text-slate-400 font-semibold">Change to:</label>
                <select
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-white focus:outline-none"
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                >
                  <option value="">Choose category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCategorySubmit}
                  disabled={!selectedCatId || isLoading}
                  className="w-full h-7 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Apply Change
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onAction('EXPORT')}
            disabled={isLoading}
            className="h-8 px-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleActionClick('ARCHIVE')}
            disabled={isLoading}
            className="h-8 px-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <span>Archive</span>
          </button>

          <button
            onClick={() => handleActionClick('RESTORE')}
            disabled={isLoading}
            className="h-8 px-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <span>Restore</span>
          </button>

          <button
            onClick={() => handleActionClick('DELETE')}
            disabled={isLoading}
            className="h-8 px-3 rounded-xl hover:bg-rose-950/40 text-rose-400 hover:text-rose-350 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>

        <button
          onClick={onClearSelection}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Confirmation Dialog Modal overlay */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 max-w-sm w-full text-center space-y-4">
            <div className="h-10 w-10 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">Confirm Bulk Action</h3>
              <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">
                Are you sure you want to perform bulk **{targetAction}** on these {selectedIds.length} selected transaction records? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default BulkOperationsToolbar;
