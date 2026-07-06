export type FilterOperator =
  | 'EQUALS'
  | 'CONTAINS'
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'IN'
  | 'BETWEEN';

export interface FilterRule {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface QueryGroup {
  logicalOperator: 'AND' | 'OR';
  rules: (FilterRule | QueryGroup)[];
}

export interface AdvancedSearchPayload {
  searchTerm?: string;
  queryGroup?: QueryGroup;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type ComparisonMode =
  | 'MONTH_VS_MONTH'
  | 'YEAR_VS_YEAR'
  | 'CATEGORY_VS_CATEGORY'
  | 'INCOME_VS_EXPENSE'
  | 'BUDGET_VS_ACTUAL';

export interface ComparisonPeriod {
  start: string;
  end: string;
}

export interface ComparisonPayload {
  mode: ComparisonMode;
  params: {
    primaryPeriod?: ComparisonPeriod;
    comparisonPeriod?: ComparisonPeriod;
    categoryIds?: string[];
    budgetId?: string;
  };
}

export interface ComparisonMetric {
  label: string;
  primaryValue: number;
  comparisonValue: number;
  percentageChange: number;
}

export interface ComparisonResult {
  metrics: ComparisonMetric[];
  tableData: Record<string, unknown>[];
}

export interface SavedViewPayload {
  name: string;
  filters: QueryGroup;
  isFavorite?: boolean;
}

export interface SavedView {
  id: string;
  name: string;
  filters: QueryGroup;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  createdAt: string;
}

export interface SuggestionsResponse {
  recentSearches: string[];
  categories: { id: string; name: string; type: string; color: string }[];
  paymentMethods: string[];
  titles: string[];
}
