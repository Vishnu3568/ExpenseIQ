import prisma from '../db';
import { ReportFilter, ReportDetails } from '../types/report';
import { budgetService } from './budgetService';

export const ReportBuilder = {
  /**
   * Builds the complete JSON data structure for a report
   */
  async buildReportData(
    userId: string,
    name: string,
    type: string,
    filters: ReportFilter,
    template: string = 'professional'
  ): Promise<ReportDetails> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    const userName = user?.name || 'User';

    // 1. Setup Transaction DB Filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txFilter: any = { userId };

    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    if (startDate || endDate) {
      txFilter.date = {};
      if (startDate) txFilter.date.gte = startDate;
      if (endDate) txFilter.date.lte = endDate;
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      txFilter.categoryId = { in: filters.categoryIds };
    }

    if (filters.types && filters.types.length > 0) {
      txFilter.type = { in: filters.types };
    }

    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      txFilter.paymentMethod = { in: filters.paymentMethods };
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      txFilter.amount = {};
      if (filters.minAmount !== undefined) txFilter.amount.gte = filters.minAmount;
      if (filters.maxAmount !== undefined) txFilter.amount.lte = filters.maxAmount;
    }

    // 2. Fetch Transactions matching filters
    const transactions = await prisma.transaction.findMany({
      where: txFilter,
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });

    // 3. Compute Basic Transaction Metrics
    let totalIncome = 0;
    let totalExpense = 0;
    let largestIncome = 0;
    let largestExpense = 0;

    for (const tx of transactions) {
      const amount = Number(tx.amount);
      if (tx.type === 'INCOME') {
        totalIncome += amount;
        if (amount > largestIncome) largestIncome = amount;
      } else {
        totalExpense += amount;
        if (amount > largestExpense) largestExpense = amount;
      }
    }

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const transactionCount = transactions.length;

    // 4. Calculate Time Span & Averages
    let daySpan = 30; // Default fallback
    let monthSpan = 1;

    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      daySpan = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      monthSpan = Math.max(1, Math.ceil(daySpan / 30.43));
    } else if (transactions.length > 0) {
      const txDates = transactions.map((t) => new Date(t.date).getTime());
      const minDate = Math.min(...txDates);
      const maxDate = Math.max(...txDates);
      const diffTime = Math.abs(maxDate - minDate);
      daySpan = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      monthSpan = Math.max(1, Math.ceil(daySpan / 30.43));
    }

    const averageDailySpend = totalExpense / daySpan;
    const averageMonthlySpend = totalExpense / monthSpan;

    // 5. Compute Category Breakdown
    const categoryMap = new Map<string, {
      id: string | null;
      name: string;
      color: string;
      icon: string;
      type: string;
      amount: number;
      count: number;
      percentage: number;
    }>();

    for (const tx of transactions) {
      const catId = tx.categoryId || 'uncategorized';
      const catName = tx.category?.name || 'Uncategorized';
      const catColor = tx.category?.color || '#6B7280';
      const catIcon = tx.category?.icon || 'tag';
      const catType = tx.category?.type || tx.type;
      const amount = Number(tx.amount);

      const existing = categoryMap.get(catId) || {
        id: tx.categoryId,
        name: catName,
        color: catColor,
        icon: catIcon,
        type: catType,
        amount: 0,
        count: 0,
        percentage: 0,
      };

      existing.amount += amount;
      existing.count += 1;
      categoryMap.set(catId, existing);
    }

    const categoryBreakdown = Array.from(categoryMap.values()).map((c) => {
      const totalForType = c.type === 'INCOME' ? totalIncome : totalExpense;
      c.percentage = totalForType > 0 ? (c.amount / totalForType) * 100 : 0;
      return c;
    }).sort((a, b) => b.amount - a.amount);

    // 6. Integrate with Budgets
    let budgetUtilization = 0;
    let overspendingCategoriesCount = 0;

    // Fetch user's budget progress list
    const budgetsProgress = await budgetService.getBudgetsProgress(userId);

    // Filter budgets that overlap with the report dates
    const reportStart = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
    const reportEnd = endDate || new Date();

    const activeBudgets = budgetsProgress.filter((b) => {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      const overlaps = bStart <= reportEnd && bEnd >= reportStart;

      if (filters.budgetId) {
        return b.id === filters.budgetId && overlaps;
      }
      if (filters.categoryIds && filters.categoryIds.length > 0 && b.categoryId) {
        return filters.categoryIds.includes(b.categoryId) && overlaps;
      }
      return overlaps;
    });

    if (activeBudgets.length > 0) {
      const totalUtil = activeBudgets.reduce((sum, b) => sum + Number(b.budgetUtilization), 0);
      budgetUtilization = totalUtil / activeBudgets.length;
      overspendingCategoriesCount = activeBudgets.filter((b) => Number(b.amountSpent) > Number(b.amount)).length;
    }

    return {
      name,
      type,
      filters,
      template,
      userName,
      generatedAt: new Date().toISOString(),
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        savingsRate,
        largestExpense,
        largestIncome,
        averageDailySpend,
        averageMonthlySpend,
        budgetUtilization,
        overspendingCategoriesCount,
        transactionCount,
      },
      transactions: transactions.map((t) => ({
        id: t.id,
        title: t.title,
        amount: Number(t.amount),
        type: t.type,
        date: t.date.toISOString(),
        paymentMethod: t.paymentMethod,
        categoryName: t.category?.name || 'Uncategorized',
        categoryColor: t.category?.color || '#6B7280',
      })),
      categoryBreakdown,
      version: '1.0.0',
    };
  },
};
