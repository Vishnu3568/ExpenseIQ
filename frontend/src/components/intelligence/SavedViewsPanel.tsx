import React, { useState } from 'react';
import { Star, Trash2, Edit3, Check, Bookmark, Plus } from 'lucide-react';
import { SavedView } from '../../types/intelligence';

interface SavedViewsPanelProps {
  views: SavedView[];
  onApply: (view: SavedView) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onRename: (id: string, name: string) => void;
  onSaveCurrent: (name: string) => void;
}

export const SavedViewsPanel: React.FC<SavedViewsPanelProps> = ({
  views,
  onApply,
  onDelete,
  onToggleFavorite,
  onRename,
  onSaveCurrent,
}) => {
  const [newViewName, setNewViewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;
    onSaveCurrent(newViewName.trim());
    setNewViewName('');
  };

  const startEditing = (view: SavedView) => {
    setEditingId(view.id);
    setEditingName(view.name);
  };

  const handleRenameSubmit = (id: string) => {
    if (!editingName.trim()) return;
    onRename(id, editingName.trim());
    setEditingId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800/50 pb-3">
        <Bookmark className="h-5 w-5 text-indigo-500" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">Saved Filter Views</h2>
      </div>

      {/* Save current view config form */}
      <form onSubmit={handleSave} className="flex gap-2">
        <input
          type="text"
          placeholder="Save current filters as..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-755 dark:text-slate-250 focus:border-indigo-500 focus:outline-none"
          value={newViewName}
          onChange={(e) => setNewViewName(e.target.value)}
        />
        <button
          type="submit"
          className="h-8 w-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors"
          title="Save current filters configuration"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {/* Views listing */}
      {views.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-400">
          No saved views yet. Configure filter rules and name them above to store shortcut views.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
          {views.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between gap-2 p-2 rounded-xl border border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
            >
              {editingId === v.id ? (
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="text"
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-800 dark:text-white focus:outline-none"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button
                    onClick={() => handleRenameSubmit(v.id)}
                    className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onApply(v)}
                  className="flex-1 text-left text-xs font-semibold text-slate-700 dark:text-slate-350 truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {v.name}
                </button>
              )}

              <div className="flex items-center gap-1">
                {/* Favorite toggler */}
                <button
                  onClick={() => onToggleFavorite(v.id, !v.isFavorite)}
                  className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    v.isFavorite
                      ? 'text-amber-500 hover:text-amber-600'
                      : 'text-slate-400 hover:text-amber-500'
                  }`}
                  title={v.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                >
                  <Star className="h-3.5 w-3.5" fill={v.isFavorite ? 'currentColor' : 'none'} />
                </button>

                {editingId !== v.id && (
                  <button
                    onClick={() => startEditing(v)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Rename view"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onDelete(v.id)}
                  className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/25 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete view"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SavedViewsPanel;
