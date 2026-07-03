import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Percent,
  ReceiptText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';

import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import {
  useInsightOverview,
  useInsightMonthly,
  useInsightWeekly,
  useInsightCategoryBreakdown,
  useInsightRecent,
  useInsightStatistics,
  useInsightCashflow,
} from '../hooks/useInsights';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { OverviewCard } from '../components/dashboard/OverviewCard';
import { RecentTransactionsList } from '../components/dashboard/RecentTransactionsList';
import { CategoryBreakdownList } from '../components/dashboard/CategoryBreakdownList';
import { StatisticsPanel } from '../components/dashboard/StatisticsPanel';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { TransactionPayload } from '../types/transaction';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { rawCategories } = useCategories();
  const { createTransaction, error: submitError } = useTransactions();

  // Load Financial Insights APIs
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useInsightOverview();
  const { data: monthly, isLoading: monthlyLoading, refetch: refetchMonthly } = useInsightMonthly();
  const { data: weekly, isLoading: weeklyLoading, refetch: refetchWeekly } = useInsightWeekly();
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useInsightCategoryBreakdown();
  const { data: recent, isLoading: recentLoading, refetch: refetchRecent } = useInsightRecent(5);
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useInsightStatistics();
  const { data: cashflow, isLoading: cashflowLoading, refetch: refetchCashflow } = useInsightCashflow();

  // Modal Dialog states for Quick Add
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currencySymbol = user?.currency === 'INR' ? '₹' : '$';

  const refetchAllInsights = () => {
    refetchOverview();
    refetchMonthly();
    refetchWeekly();
    refetchCategories();
    refetchRecent();
    refetchStats();
    refetchCashflow();
  };

  const handleQuickAddSubmit = async (payload: TransactionPayload) => {
    await createTransaction(payload);
    setIsModalOpen(false);
    refetchAllInsights();
  };

  const formatCurrency = (val: number) => {
    return `${currencySymbol}${Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Recharts Expense Category allocations filtering
  const expenseBreakdown = categories
    .filter((c) => c.type === 'EXPENSE' && c.amount > 0)
    .map((c) => ({
      name: c.name,
      value: Number(c.amount),
      color: c.color,
    }));

  const chartTheme = {
    grid: '#F1F5F9',
    gridDark: '#1E293B',
    text: '#94A3B8',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Header Section */}
      <DashboardHeader
        userName={user?.name}
        onQuickAddClick={() => setIsModalOpen(true)}
      />

      {/* 2. Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <OverviewCard
          title="Total Income"
          value={overviewLoading ? '...' : formatCurrency(overview?.totalIncome || 0)}
          description="Accumulated lifetime income flows"
          icon={TrendingUp}
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          bgColorClass="bg-emerald-50 dark:bg-emerald-950/20"
        />

        <OverviewCard
          title="Total Expense"
          value={overviewLoading ? '...' : formatCurrency(overview?.totalExpense || 0)}
          description="Accumulated lifetime cash spent"
          icon={TrendingDown}
          iconColorClass="text-rose-600 dark:text-rose-400"
          bgColorClass="bg-rose-50 dark:bg-rose-950/20"
        />

        <OverviewCard
          title="Net Balance"
          value={overviewLoading ? '...' : formatCurrency(overview?.netBalance || 0)}
          description="Current net cash reserve"
          icon={Scale}
          iconColorClass="text-indigo-600 dark:text-indigo-400"
          bgColorClass="bg-indigo-50 dark:bg-indigo-950/20"
        />

        <OverviewCard
          title="Savings Rate"
          value={overviewLoading ? '...' : `${Number(overview?.savingsRate || 0).toFixed(1)}%`}
          description="Percentage of income saved"
          icon={Percent}
          iconColorClass="text-amber-600 dark:text-amber-400"
          bgColorClass="bg-amber-50 dark:bg-amber-950/20"
          trend={
            overview && overview.savingsRate >= 20
              ? { value: 'Healthy', isPositive: true }
              : overview && overview.savingsRate > 0
                ? { value: 'Moderate', isPositive: true }
                : { value: 'Low', isPositive: false }
          }
        />

        <OverviewCard
          title="Transactions"
          value={overviewLoading ? '...' : overview?.transactionCount || 0}
          description="Total recorded activities"
          icon={ReceiptText}
          iconColorClass="text-sky-600 dark:text-sky-400"
          bgColorClass="bg-sky-50 dark:bg-sky-950/20"
        />
      </div>

      {/* 3. Charts & Sidebar Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Financial Visual Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Row Charts: Monthly (Line) and Cashflow (Area) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Monthly Income vs Expense (Line Chart) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Monthly Income vs Expense
              </h3>
              <div className="h-64">
                {monthlyLoading ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-400 animate-pulse">Loading Chart...</div>
                ) : monthly.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthly} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                      <XAxis dataKey="month" stroke={chartTheme.text} fontSize={11} />
                      <YAxis stroke={chartTheme.text} fontSize={11} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11, pt: 10 }} />
                      <Line type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 2: Cash Flow Trend (Area Chart) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Cash Flow Area
              </h3>
              <div className="h-64">
                {cashflowLoading ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-400 animate-pulse">Loading Chart...</div>
                ) : cashflow.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashflow} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                      <XAxis dataKey="date" stroke={chartTheme.text} fontSize={11} />
                      <YAxis stroke={chartTheme.text} fontSize={11} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="income" name="Inflow" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expense" name="Outflow" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Chart 3: Weekly Activity (Bar Chart) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Weekly Activity
            </h3>
            <div className="h-64">
              {weeklyLoading ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-400 animate-pulse">Loading Chart...</div>
              ) : weekly.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                    <XAxis dataKey="weekStarting" stroke={chartTheme.text} fontSize={11} />
                    <YAxis stroke={chartTheme.text} fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Sidebar Feed Panels */}
        <div className="space-y-6">
          {/* Donut Chart: Expense by Category */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Expense by Category
            </h3>
            <div className="h-48 flex items-center justify-center">
              {categoriesLoading ? (
                <div className="text-sm text-slate-400 animate-pulse">Loading breakdown...</div>
              ) : expenseBreakdown.length === 0 ? (
                <div className="text-sm text-slate-400">No expense records found</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Top Spending Categories List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Top Spending Categories
            </h3>
            <CategoryBreakdownList
              categories={categories}
              currencySymbol={currencySymbol}
              isLoading={categoriesLoading}
            />
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Recent Transactions
            </h3>
            <RecentTransactionsList
              transactions={recent}
              currencySymbol={currencySymbol}
              isLoading={recentLoading}
            />
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Advanced Statistics Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-855 dark:text-slate-200 mb-5">
          Executive Financial Highlights
        </h3>
        <StatisticsPanel
          stats={stats}
          currencySymbol={currencySymbol}
          isLoading={statsLoading}
        />
      </div>

      {/* 5. Quick Add Transaction Modal Overlay */}
      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleQuickAddSubmit}
          categories={rawCategories}
          existingTransactions={recent}
          error={submitError || undefined}
        />
      )}
    </div>
  );
};
export default Dashboard;
