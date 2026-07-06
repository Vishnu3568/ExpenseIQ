import React from 'react';
import { Plus, Trash2, Sliders } from 'lucide-react';
import { FilterRule, QueryGroup, FilterOperator } from '../../types/intelligence';

interface QueryBuilderProps {
  categories: { id: string; name: string; type: string }[];
  paymentMethods: string[];
  budgets: { id: string; name: string }[];
  queryGroup: QueryGroup;
  onChange: (group: QueryGroup) => void;
}

const FIELDS = [
  { value: 'amount', label: 'Amount' },
  { value: 'date', label: 'Date' },
  { value: 'type', label: 'Type' },
  { value: 'categoryId', label: 'Category' },
  { value: 'paymentMethod', label: 'Payment Method' },
  { value: 'budgetId', label: 'Budget' },
  { value: 'categoryArchived', label: 'Show Archived Category' },
];

const OPERATORS_MAP: Record<string, { value: FilterOperator; label: string }[]> = {
  amount: [
    { value: 'EQUALS', label: '=' },
    { value: 'GREATER_THAN', label: '>' },
    { value: 'LESS_THAN', label: '<' },
    { value: 'BETWEEN', label: 'Between' },
  ],
  date: [
    { value: 'EQUALS', label: 'Is' },
    { value: 'BETWEEN', label: 'Between' },
  ],
  type: [{ value: 'EQUALS', label: 'Is' }],
  categoryId: [
    { value: 'EQUALS', label: 'Is' },
    { value: 'IN', label: 'In List' },
  ],
  paymentMethod: [
    { value: 'EQUALS', label: 'Is' },
    { value: 'CONTAINS', label: 'Contains' },
  ],
  budgetId: [{ value: 'EQUALS', label: 'Matches Budget' }],
  categoryArchived: [{ value: 'EQUALS', label: 'Is' }],
};

export const QueryBuilder: React.FC<QueryBuilderProps> = ({
  categories,
  paymentMethods,
  budgets,
  queryGroup,
  onChange,
}) => {
  const handleAddRule = () => {
    const newRule: FilterRule = {
      field: 'amount',
      operator: 'EQUALS',
      value: '',
    };
    onChange({
      ...queryGroup,
      rules: [...queryGroup.rules, newRule],
    });
  };

  const handleAddGroup = () => {
    const newGroup: QueryGroup = {
      logicalOperator: 'AND',
      rules: [],
    };
    onChange({
      ...queryGroup,
      rules: [...queryGroup.rules, newGroup],
    });
  };

  const handleRemoveRule = (index: number) => {
    const newRules = [...queryGroup.rules];
    newRules.splice(index, 1);
    onChange({
      ...queryGroup,
      rules: newRules,
    });
  };

  const handleRuleChange = (index: number, updatedRule: FilterRule | QueryGroup) => {
    const newRules = [...queryGroup.rules];
    newRules[index] = updatedRule;
    onChange({
      ...queryGroup,
      rules: newRules,
    });
  };

  const handleToggleLogicalOperator = () => {
    onChange({
      ...queryGroup,
      logicalOperator: queryGroup.logicalOperator === 'AND' ? 'OR' : 'AND',
    });
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
      {/* Group Controls header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Match rules using</span>
          <button
            type="button"
            onClick={handleToggleLogicalOperator}
            className="h-6 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider transition-colors"
          >
            {queryGroup.logicalOperator}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAddRule}
            className="h-7 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Add Rule</span>
          </button>
          <button
            type="button"
            onClick={handleAddGroup}
            className="h-7 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      {/* Rules list */}
      {queryGroup.rules.length === 0 ? (
        <div className="text-center py-6 text-[11px] text-slate-400">
          No filters set. Click Add Rule to configure transactions scope criteria.
        </div>
      ) : (
        <div className="space-y-3.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          {queryGroup.rules.map((rule, idx) => {
            const isGroup = 'logicalOperator' in rule;

            if (isGroup) {
              return (
                <div key={idx} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="absolute -left-7 top-2.5 p-1 rounded-lg text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <QueryBuilder
                    categories={categories}
                    paymentMethods={paymentMethods}
                    budgets={budgets}
                    queryGroup={rule as QueryGroup}
                    onChange={(updated) => handleRuleChange(idx, updated)}
                  />
                </div>
              );
            }

            const ruleItem = rule as FilterRule;
            const validOperators = OPERATORS_MAP[ruleItem.field] || [];

            return (
              <div key={idx} className="flex items-center gap-2 flex-wrap sm:flex-nowrap group">
                {/* Field dropdown selector */}
                <select
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 shadow-sm focus:border-indigo-500 focus:outline-none shrink-0"
                  value={ruleItem.field}
                  onChange={(e) => {
                    const field = e.target.value;
                    const ops = OPERATORS_MAP[field] || [];
                    const defaultOp = ops[0]?.value || 'EQUALS';
                    handleRuleChange(idx, {
                      field,
                      operator: defaultOp,
                      value: field === 'categoryArchived' ? 'false' : '',
                    });
                  }}
                >
                  {FIELDS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {/* Operator select */}
                <select
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 shadow-sm focus:border-indigo-500 focus:outline-none shrink-0"
                  value={ruleItem.operator}
                  onChange={(e) => {
                    const operator = e.target.value as FilterOperator;
                    const value = operator === 'BETWEEN' ? ['', ''] : '';
                    handleRuleChange(idx, { ...ruleItem, operator, value });
                  }}
                >
                  {validOperators.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                {/* Render Value Inputs based on Field and Operator */}
                <div className="flex-1 min-w-[150px]">
                  {ruleItem.field === 'categoryArchived' ? (
                    <select
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
                      value={String(ruleItem.value)}
                      onChange={(e) =>
                        handleRuleChange(idx, { ...ruleItem, value: e.target.value === 'true' })
                      }
                    >
                      <option value="false">No (Active Only)</option>
                      <option value="true">Yes (Include Archived)</option>
                    </select>
                  ) : ruleItem.field === 'categoryId' ? (
                    ruleItem.operator === 'IN' ? (
                      <select
                        multiple
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none min-h-[60px]"
                        value={Array.isArray(ruleItem.value) ? ruleItem.value : []}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, (o) => o.value);
                          handleRuleChange(idx, { ...ruleItem, value: values });
                        }}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.type})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
                        value={String(ruleItem.value)}
                        onChange={(e) => handleRuleChange(idx, { ...ruleItem, value: e.target.value })}
                      >
                        <option value="">Choose category...</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.type})
                          </option>
                        ))}
                      </select>
                    )
                  ) : ruleItem.field === 'budgetId' ? (
                    <select
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
                      value={String(ruleItem.value)}
                      onChange={(e) => handleRuleChange(idx, { ...ruleItem, value: e.target.value })}
                    >
                      <option value="">Select budget...</option>
                      {budgets.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  ) : ruleItem.field === 'paymentMethod' ? (
                    <select
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
                      value={String(ruleItem.value)}
                      onChange={(e) => handleRuleChange(idx, { ...ruleItem, value: e.target.value })}
                    >
                      <option value="">Select method...</option>
                      {paymentMethods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  ) : ruleItem.field === 'type' ? (
                    <select
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
                      value={String(ruleItem.value)}
                      onChange={(e) => handleRuleChange(idx, { ...ruleItem, value: e.target.value })}
                    >
                      <option value="">Select type...</option>
                      <option value="INCOME">Income Only</option>
                      <option value="EXPENSE">Expense Only</option>
                    </select>
                  ) : ruleItem.operator === 'BETWEEN' ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type={ruleItem.field === 'date' ? 'date' : 'number'}
                        placeholder="Min"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
                        value={Array.isArray(ruleItem.value) ? ruleItem.value[0] || '' : ''}
                        onChange={(e) => {
                          const val2 = Array.isArray(ruleItem.value) ? ruleItem.value[1] || '' : '';
                          handleRuleChange(idx, { ...ruleItem, value: [e.target.value, val2] });
                        }}
                      />
                      <span className="text-[10px] text-slate-400">to</span>
                      <input
                        type={ruleItem.field === 'date' ? 'date' : 'number'}
                        placeholder="Max"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
                        value={Array.isArray(ruleItem.value) ? ruleItem.value[1] || '' : ''}
                        onChange={(e) => {
                          const val1 = Array.isArray(ruleItem.value) ? ruleItem.value[0] || '' : '';
                          handleRuleChange(idx, { ...ruleItem, value: [val1, e.target.value] });
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      type={ruleItem.field === 'date' ? 'date' : ruleItem.field === 'amount' ? 'number' : 'text'}
                      placeholder={ruleItem.field === 'amount' ? '0.00' : 'Filter parameter...'}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
                      value={ruleItem.value || ''}
                      onChange={(e) => handleRuleChange(idx, { ...ruleItem, value: e.target.value })}
                    />
                  )}
                </div>

                {/* Delete rule action */}
                <button
                  type="button"
                  onClick={() => handleRemoveRule(idx)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default QueryBuilder;
