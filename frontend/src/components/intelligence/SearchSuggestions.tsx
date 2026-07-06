import React from 'react';
import { History, Tag, CreditCard, Type } from 'lucide-react';
import { SuggestionsResponse } from '../../types/intelligence';

interface SearchSuggestionsProps {
  suggestions: SuggestionsResponse | null;
  searchTerm: string;
  onSelectSuggestion: (val: string, field?: string) => void;
  onClose: () => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  searchTerm,
  onSelectSuggestion,
  onClose,
}) => {
  if (!suggestions) return null;

  const { recentSearches, categories, paymentMethods, titles } = suggestions;

  const filteredTitles = titles.filter((t) =>
    t.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredMethods = paymentMethods.filter((m) =>
    m.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSuggestions =
    recentSearches.length > 0 ||
    filteredTitles.length > 0 ||
    filteredCategories.length > 0 ||
    filteredMethods.length > 0;

  if (!hasSuggestions) return null;

  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-30 py-2.5 max-h-[350px] overflow-y-auto text-left">
        {/* Recent Searches */}
        {recentSearches.length > 0 && searchTerm === '' && (
          <div className="space-y-1">
            <span className="px-3.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Recent Searches
            </span>
            {recentSearches.slice(0, 5).map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion(q)}
                className="w-full px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
              >
                <History className="h-3.5 w-3.5 text-slate-400" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        )}

        {/* Categories */}
        {filteredCategories.length > 0 && (
          <div className="space-y-1 mt-2.5">
            <span className="px-3.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Matching Categories
            </span>
            {filteredCategories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectSuggestion(c.id, 'categoryId')}
                className="w-full px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
              >
                <Tag className="h-3.5 w-3.5" style={{ color: c.color }} />
                <span>
                  {c.name} ({c.type.toLowerCase()})
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Payment Methods */}
        {filteredMethods.length > 0 && (
          <div className="space-y-1 mt-2.5">
            <span className="px-3.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Payment Methods
            </span>
            {filteredMethods.map((m, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion(m, 'paymentMethod')}
                className="w-full px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
              >
                <CreditCard className="h-3.5 w-3.5 text-slate-450" />
                <span>{m}</span>
              </button>
            ))}
          </div>
        )}

        {/* Titles */}
        {filteredTitles.length > 0 && searchTerm !== '' && (
          <div className="space-y-1 mt-2.5">
            <span className="px-3.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Matching Titles
            </span>
            {filteredTitles.slice(0, 5).map((t, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion(t)}
                className="w-full px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
              >
                <Type className="h-3.5 w-3.5 text-slate-400" />
                <span>{t}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default SearchSuggestions;
