import prisma from '../db';

export const insightService = {
  /**
   * Get Overview metrics (total income, total expense, balance, savings rate, tx count)
   */
  async getOverview(userId: string) {
    const incomeAgg = await prisma.transaction.aggregate({
      where: { userId, type: 'INCOME' },
      _sum: { amount: true },
    });

    const expenseAgg = await prisma.transaction.aggregate({
      where: { userId, type: 'EXPENSE' },
      _sum: { amount: true },
    });

    const totalIncome = incomeAgg._sum.amount ? Number(incomeAgg._sum.amount) : 0;
    const totalExpense = expenseAgg._sum.amount ? Number(expenseAgg._sum.amount) : 0;
    const netBalance = totalIncome - totalExpense;

    let savingsRate = 0;
    if (totalIncome > 0) {
      savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
    }

    const transactionCount = await prisma.transaction.count({
      where: { userId },
    });

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      transactionCount,
    };
  },

  /**
   * Get Monthly summaries (YYYY-MM, Income, Expense, Balance)
   */
  async getMonthlyBreakdown(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: { amount: true, type: true, date: true },
      orderBy: { date: 'asc' },
    });

    const monthlyMap = new Map<string, { income: number; expense: number }>();

    for (const tx of transactions) {
      const d = new Date(tx.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;

      const amt = Number(tx.amount);
      const current = monthlyMap.get(key) || { income: 0, expense: 0 };

      if (tx.type === 'INCOME') {
        current.income += amt;
      } else {
        current.expense += amt;
      }
      monthlyMap.set(key, current);
    }

    const result = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
    }));

    return result;
  },

  /**
   * Get Weekly summaries
   */
  async getWeeklyBreakdown(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: { amount: true, type: true, date: true },
      orderBy: { date: 'asc' },
    });

    const weeklyMap = new Map<string, { income: number; expense: number }>();

    for (const tx of transactions) {
      const d = new Date(tx.date);
      // Determine week starting date (Sunday as first day of week)
      const day = d.getDay();
      const diff = d.getDate() - day;
      const weekStart = new Date(d.setDate(diff));
      const key = weekStart.toISOString().split('T')[0];

      const amt = Number(tx.amount);
      const current = weeklyMap.get(key) || { income: 0, expense: 0 };

      if (tx.type === 'INCOME') {
        current.income += amt;
      } else {
        current.expense += amt;
      }
      weeklyMap.set(key, current);
    }

    const result = Array.from(weeklyMap.entries()).map(([weekStarting, data]) => ({
      weekStarting,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
    }));

    return result;
  },

  /**
   * Get Category breakdown (Amount, Percentage, Count)
   */
  async getCategoryBreakdown(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
            isActive: true,
          },
        },
      },
    });

    // Compute type totals first to calculate accurate percentages
    let totalIncome = 0;
    let totalExpense = 0;

    const categoryMap = new Map<
      string,
      {
        categoryId: string | null;
        name: string;
        color: string;
        icon: string;
        type: 'INCOME' | 'EXPENSE';
        amount: number;
        transactionCount: number;
      }
    >();

    for (const tx of transactions) {
      const amt = Number(tx.amount);
      if (tx.type === 'INCOME') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }

      // Group uncategorized transactions together under a mock entity
      const catId = tx.categoryId || 'uncategorized';
      const catName = tx.category?.name || 'Uncategorized';
      const catColor = tx.category?.color || '#6B7280';
      const catIcon = tx.category?.icon || 'tag';
      const catType = (tx.category?.type || tx.type) as 'INCOME' | 'EXPENSE';

      const current = categoryMap.get(catId) || {
        categoryId: tx.categoryId,
        name: catName,
        color: catColor,
        icon: catIcon,
        type: catType,
        amount: 0,
        transactionCount: 0,
      };

      current.amount += amt;
      current.transactionCount += 1;
      categoryMap.set(catId, current);
    }

    const result = Array.from(categoryMap.values()).map((item) => {
      const typeTotal = item.type === 'INCOME' ? totalIncome : totalExpense;
      const percentage = typeTotal > 0 ? (item.amount / typeTotal) * 100 : 0;

      return {
        ...item,
        percentage,
      };
    });

    // Sort by amount descending
    result.sort((a, b) => b.amount - a.amount);

    return result;
  },

  /**
   * Get recent transactions
   */
  async getRecentTransactions(userId: string, limit: number = 10) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: {
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return transactions;
  },

  /**
   * Get advanced statistics highlights
   */
  async getStatistics(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: { amount: true, type: true, date: true },
      orderBy: { date: 'asc' },
    });

    if (transactions.length === 0) {
      return {
        largestIncome: 0,
        largestExpense: 0,
        averageIncome: 0,
        averageExpense: 0,
        highestSpendingDay: null,
        highestIncomeDay: null,
        averageDailySpend: 0,
        averageMonthlySpend: 0,
      };
    }

    let maxIncome = 0;
    let maxExpense = 0;
    let sumIncome = 0;
    let sumExpense = 0;
    let countIncome = 0;
    let countExpense = 0;

    const dailySpendingMap = new Map<string, number>();
    const dailyIncomeMap = new Map<string, number>();
    const monthlySpendingMap = new Map<string, number>();

    for (const tx of transactions) {
      const amt = Number(tx.amount);
      const dateKey = new Date(tx.date).toISOString().split('T')[0];
      const monthKey = dateKey.slice(0, 7); // YYYY-MM

      if (tx.type === 'INCOME') {
        if (amt > maxIncome) maxIncome = amt;
        sumIncome += amt;
        countIncome += 1;

        dailyIncomeMap.set(dateKey, (dailyIncomeMap.get(dateKey) || 0) + amt);
      } else {
        if (amt > maxExpense) maxExpense = amt;
        sumExpense += amt;
        countExpense += 1;

        dailySpendingMap.set(dateKey, (dailySpendingMap.get(dateKey) || 0) + amt);
        monthlySpendingMap.set(monthKey, (monthlySpendingMap.get(monthKey) || 0) + amt);
      }
    }

    // Determine highest spending day
    let highestSpendingDay: string | null = null;
    let maxDailySpend = 0;
    for (const [day, val] of dailySpendingMap.entries()) {
      if (val > maxDailySpend) {
        maxDailySpend = val;
        highestSpendingDay = day;
      }
    }

    // Determine highest income day
    let highestIncomeDay: string | null = null;
    let maxDailyIncome = 0;
    for (const [day, val] of dailyIncomeMap.entries()) {
      if (val > maxDailyIncome) {
        maxDailyIncome = val;
        highestIncomeDay = day;
      }
    }

    // Calculate unique days and months spanning transaction history
    const firstDate = new Date(transactions[0].date);
    const lastDate = new Date(transactions[transactions.length - 1].date);
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    const daySpan = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const firstMonthYear = firstDate.getFullYear() * 12 + firstDate.getMonth();
    const lastMonthYear = lastDate.getFullYear() * 12 + lastDate.getMonth();
    const monthSpan = Math.abs(lastMonthYear - firstMonthYear) + 1;

    const averageIncome = countIncome > 0 ? sumIncome / countIncome : 0;
    const averageExpense = countExpense > 0 ? sumExpense / countExpense : 0;
    const averageDailySpend = sumExpense / daySpan;
    const averageMonthlySpend = sumExpense / monthSpan;

    return {
      largestIncome: maxIncome,
      largestExpense: maxExpense,
      averageIncome,
      averageExpense,
      highestSpendingDay,
      highestIncomeDay,
      averageDailySpend,
      averageMonthlySpend,
    };
  },

  /**
   * Get cashflow aggregates (date, income, expense) ordered chronologically
   */
  async getCashflow(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: { amount: true, type: true, date: true },
      orderBy: { date: 'asc' },
    });

    const cashflowMap = new Map<string, { income: number; expense: number }>();

    for (const tx of transactions) {
      const dateKey = new Date(tx.date).toISOString().split('T')[0];
      const amt = Number(tx.amount);

      const current = cashflowMap.get(dateKey) || { income: 0, expense: 0 };
      if (tx.type === 'INCOME') {
        current.income += amt;
      } else {
        current.expense += amt;
      }
      cashflowMap.set(dateKey, current);
    }

    const result = Array.from(cashflowMap.entries()).map(([date, data]) => ({
      date,
      income: data.income,
      expense: data.expense,
    }));

    return result;
  },
};
