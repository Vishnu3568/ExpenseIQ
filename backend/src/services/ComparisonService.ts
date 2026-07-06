import { Prisma } from '@prisma/client';
import prisma from '../db';
import { ComparisonPayload, ComparisonResult, ComparisonMetric } from '../types/intelligence';

export const ComparisonService = {
  /**
   * Run comparison analytics
   */
  async compare(userId: string, payload: ComparisonPayload): Promise<ComparisonResult> {
    const { mode, params } = payload;

    switch (mode) {
      case 'MONTH_VS_MONTH':
      case 'YEAR_VS_YEAR':
        return this.comparePeriods(userId, params.primaryPeriod, params.comparisonPeriod);

      case 'CATEGORY_VS_CATEGORY':
        return this.compareCategories(userId, params.categoryIds || [], params.primaryPeriod);

      case 'INCOME_VS_EXPENSE':
        return this.compareIncomeExpense(userId, params.primaryPeriod);

      case 'BUDGET_VS_ACTUAL':
        return this.compareBudgetActual(userId, params.budgetId);

      default:
        throw new Error(`Unsupported comparison mode: ${mode}`);
    }
  },

  /**
   * Compare two date ranges (Month vs Month / Year vs Year)
   */
  async comparePeriods(
    userId: string,
    primary?: { start: string; end: string },
    comparison?: { start: string; end: string }
  ): Promise<ComparisonResult> {
    if (!primary || !comparison) {
      throw new Error('Both primaryPeriod and comparisonPeriod are required');
    }

    const pStart = new Date(primary.start);
    const pEnd = new Date(primary.end);
    const cStart = new Date(comparison.start);
    const cEnd = new Date(comparison.end);

    // Fetch transactions in parallel
    const [pTx, cTx] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId, date: { gte: pStart, lte: pEnd } },
      }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: cStart, lte: cEnd } },
      }),
    ]);

    // Aggregate primary period
    let pIncome = 0;
    let pExpense = 0;
    pTx.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'INCOME') pIncome += amt;
      else pExpense += amt;
    });

    // Aggregate comparison period
    let cIncome = 0;
    let cExpense = 0;
    cTx.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'INCOME') cIncome += amt;
      else cExpense += amt;
    });

    const pNet = pIncome - pExpense;
    const cNet = cIncome - cExpense;

    const pSavingsRate = pIncome > 0 ? (pNet / pIncome) * 100 : 0;
    const cSavingsRate = cIncome > 0 ? (cNet / cIncome) * 100 : 0;

    const calculateChange = (pVal: number, cVal: number) => {
      if (cVal === 0) return pVal > 0 ? 100 : 0;
      return ((pVal - cVal) / cVal) * 100;
    };

    const metrics: ComparisonMetric[] = [
      {
        label: 'Total Income',
        primaryValue: pIncome,
        comparisonValue: cIncome,
        percentageChange: calculateChange(pIncome, cIncome),
      },
      {
        label: 'Total Expense',
        primaryValue: pExpense,
        comparisonValue: cExpense,
        percentageChange: calculateChange(pExpense, cExpense),
      },
      {
        label: 'Net Balance',
        primaryValue: pNet,
        comparisonValue: cNet,
        percentageChange: calculateChange(pNet, cNet),
      },
      {
        label: 'Savings Rate (%)',
        primaryValue: pSavingsRate,
        comparisonValue: cSavingsRate,
        percentageChange: pSavingsRate - cSavingsRate, // Absolute change for rates
      },
    ];

    const tableData = [
      { metric: 'Total Income', currentPeriod: pIncome, previousPeriod: cIncome, deltaPercent: calculateChange(pIncome, cIncome) },
      { metric: 'Total Expense', currentPeriod: pExpense, previousPeriod: cExpense, deltaPercent: calculateChange(pExpense, cExpense) },
      { metric: 'Net Savings', currentPeriod: pNet, previousPeriod: cNet, deltaPercent: calculateChange(pNet, cNet) },
    ];

    return { metrics, tableData };
  },

  /**
   * Compare multiple categories
   */
  async compareCategories(
    userId: string,
    categoryIds: string[],
    period?: { start: string; end: string }
  ): Promise<ComparisonResult> {
    if (categoryIds.length === 0) {
      throw new Error('At least one category ID is required');
    }

    const where: Prisma.TransactionWhereInput = {
      userId,
      categoryId: { in: categoryIds },
    };

    if (period) {
      where.date = {
        gte: new Date(period.start),
        lte: new Date(period.end),
      };
    }

    const [txs, categories] = await Promise.all([
      prisma.transaction.findMany({ where }),
      prisma.category.findMany({ where: { id: { in: categoryIds } } }),
    ]);

    const catMap = new Map<string, number>();
    categoryIds.forEach((id) => catMap.set(id, 0));

    let totalSpend = 0;
    txs.forEach((t) => {
      if (t.categoryId && t.type === 'EXPENSE') {
        const amt = Number(t.amount);
        catMap.set(t.categoryId, (catMap.get(t.categoryId) || 0) + amt);
        totalSpend += amt;
      }
    });

    const metrics: ComparisonMetric[] = categories.map((cat) => {
      const spend = catMap.get(cat.id) || 0;
      const pct = totalSpend > 0 ? (spend / totalSpend) * 100 : 0;
      return {
        label: cat.name,
        primaryValue: spend,
        comparisonValue: totalSpend,
        percentageChange: pct, // We'll use percentageChange as share of total spending
      };
    });

    const tableData = categories.map((cat) => {
      const spend = catMap.get(cat.id) || 0;
      const pct = totalSpend > 0 ? (spend / totalSpend) * 100 : 0;
      return {
        categoryName: cat.name,
        amountSpent: spend,
        shareOfTotalPercent: pct,
      };
    });

    return { metrics, tableData };
  },

  /**
   * Compare total Income vs Expense
   */
  async compareIncomeExpense(
    userId: string,
    period?: { start: string; end: string }
  ): Promise<ComparisonResult> {
    const where: Prisma.TransactionWhereInput = { userId };
    if (period) {
      where.date = {
        gte: new Date(period.start),
        lte: new Date(period.end),
      };
    }

    const txs = await prisma.transaction.findMany({ where });

    let income = 0;
    let expense = 0;

    txs.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'INCOME') income += amt;
      else expense += amt;
    });

    const net = income - expense;
    const expenseRatio = income > 0 ? (expense / income) * 100 : 0;

    const metrics: ComparisonMetric[] = [
      {
        label: 'Inflows (Income)',
        primaryValue: income,
        comparisonValue: expense,
        percentageChange: income - expense,
      },
      {
        label: 'Outflows (Expense)',
        primaryValue: expense,
        comparisonValue: income,
        percentageChange: expenseRatio,
      },
    ];

    const tableData = [
      { type: 'Income', amount: income, percentage: 100 },
      { type: 'Expense', amount: expense, percentage: expenseRatio },
      { type: 'Net Flow', amount: net, percentage: income > 0 ? (net / income) * 100 : 0 },
    ];

    return { metrics, tableData };
  },

  /**
   * Compare Budget limit amount vs Actual spending
   */
  async compareBudgetActual(userId: string, budgetId?: string): Promise<ComparisonResult> {
    if (!budgetId) {
      throw new Error('BudgetId parameter is required');
    }

    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { category: true },
    });

    if (!budget || budget.userId !== userId) {
      throw new Error('Budget not found');
    }

    const categoryId = budget.categoryId;
    const txWhere: Prisma.TransactionWhereInput = {
      userId,
      date: { gte: budget.startDate, lte: budget.endDate },
    };

    if (categoryId) {
      txWhere.categoryId = categoryId;
    } else {
      txWhere.type = 'EXPENSE'; // Overall budget
    }

    const txs = await prisma.transaction.findMany({ where: txWhere });

    let actualSpend = 0;
    txs.forEach((t) => {
      if (t.type === 'EXPENSE') {
        actualSpend += Number(t.amount);
      }
    });

    const limit = Number(budget.amount);
    const variance = limit - actualSpend;
    const utilizationPct = limit > 0 ? (actualSpend / limit) * 100 : 0;

    const metrics: ComparisonMetric[] = [
      {
        label: budget.name,
        primaryValue: actualSpend,
        comparisonValue: limit,
        percentageChange: utilizationPct,
      },
    ];

    const tableData = [
      {
        budgetName: budget.name,
        scope: categoryId ? budget.category?.name || 'Category' : 'Overall Platform',
        limitAmount: limit,
        actualSpend,
        remainingAmount: variance,
        utilizationRatePercent: utilizationPct,
      },
    ];

    return { metrics, tableData };
  },
};
export default ComparisonService;
