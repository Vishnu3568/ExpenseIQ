import prisma from '../db';

export const budgetService = {
  /**
   * Helper to calculate statistical progress metrics for a single budget
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async calculateBudgetProgress(budget: any) {
    const amount = Number(budget.amount);
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    const now = new Date();

    // 1. Fetch sum of matching transactions (type = EXPENSE) within the budget dates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transactionFilter: any = {
      userId: budget.userId,
      type: 'EXPENSE',
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (budget.type === 'CATEGORY' && budget.categoryId) {
      transactionFilter.categoryId = budget.categoryId;
    }

    const txAgg = await prisma.transaction.aggregate({
      where: transactionFilter,
      _sum: { amount: true },
    });

    const amountSpent = txAgg._sum.amount ? Number(txAgg._sum.amount) : 0;
    const remainingBudget = amount - amountSpent;
    const budgetProgress = amount > 0 ? (amountSpent / amount) * 100 : 0;
    const remainingPercentage = Math.max(0, 100 - budgetProgress);

    // Calculate days remaining
    let daysRemaining = 0;
    if (now < endDate) {
      const activeStart = now > startDate ? now : startDate;
      const diffTime = endDate.getTime() - activeStart.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const dailyRecommendedSpending =
      daysRemaining > 0 && remainingBudget > 0 ? remainingBudget / daysRemaining : 0;

    const overspendingDetection = amountSpent > amount;
    const budgetUtilization = budgetProgress;

    return {
      ...budget,
      amountSpent,
      remainingBudget,
      remainingPercentage,
      budgetProgress,
      daysRemaining,
      dailyRecommendedSpending,
      overspendingDetection,
      budgetUtilization,
    };
  },

  /**
   * Get all budgets for a user
   */
  async getAllBudgets(userId: string) {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return budgets;
  },

  /**
   * Get a budget by ID
   */
  async getBudgetById(id: string, userId: string) {
    const budget = await prisma.budget.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });
    return budget;
  },

  /**
   * Create a new budget
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createBudget(userId: string, data: any) {
    // Prevent duplicate active/overlapping budgets for the same category (or overall) and period
    const existing = await prisma.budget.findFirst({
      where: {
        userId,
        type: data.type,
        categoryId: data.type === 'CATEGORY' ? data.categoryId : null,
        status: 'ACTIVE',
        OR: [
          {
            startDate: { lte: new Date(data.endDate) },
            endDate: { gte: new Date(data.startDate) },
          },
        ],
      },
    });

    if (existing) {
      throw new Error('An active budget already overlaps with this period.');
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        name: data.name,
        amount: data.amount,
        type: data.type,
        categoryId: data.type === 'CATEGORY' ? data.categoryId : null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status || 'ACTIVE',
        notes: data.notes,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return budget;
  },

  /**
   * Update an existing budget
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateBudget(id: string, userId: string, data: any) {
    // Validate ownership
    const budget = await prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    const updated = await prisma.budget.update({
      where: { id },
      data: {
        name: data.name,
        amount: data.amount,
        type: data.type,
        categoryId: data.type === 'CATEGORY' ? data.categoryId : null,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: data.status,
        notes: data.notes,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return updated;
  },

  /**
   * Delete a budget
   */
  async deleteBudget(id: string, userId: string) {
    const budget = await prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    await prisma.budget.delete({
      where: { id },
    });

    return true;
  },

  /**
   * Get Budgets Progress List (combines budget records with progress metrics)
   */
  async getBudgetsProgress(userId: string) {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    const progressList = await Promise.all(
      budgets.map((b) => this.calculateBudgetProgress(b))
    );

    return progressList;
  },

  /**
   * Get Budgets Overview Statistics Summary
   */
  async getBudgetsOverview(userId: string) {
    const activeBudgets = await prisma.budget.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    const progressList = await Promise.all(
      activeBudgets.map((b) => this.calculateBudgetProgress(b))
    );

    let totalBudget = 0;
    let totalSpent = 0;
    let overspentCount = 0;

    for (const item of progressList) {
      totalBudget += Number(item.amount);
      totalSpent += item.amountSpent;
      if (item.overspendingDetection) {
        overspentCount += 1;
      }
    }

    const remainingBudget = totalBudget - totalSpent;

    // Calculate budget health score (0-100)
    // Formula: 100 - (overspentCount / totalCount) * 100, or based on spent ratio
    let budgetHealthScore = 100;
    if (progressList.length > 0) {
      const overspentRatio = (overspentCount / progressList.length) * 100;
      budgetHealthScore = Math.max(0, Math.round(100 - overspentRatio));
    }

    const overspentCategories = progressList
      .filter((item) => item.overspendingDetection && item.type === 'CATEGORY')
      .map((item) => ({
        categoryId: item.categoryId,
        name: item.category?.name || 'Uncategorized',
        amount: item.amount,
        amountSpent: item.amountSpent,
        overspentAmount: item.amountSpent - item.amount,
      }));

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      overspentCategories,
      budgetHealthScore,
    };
  },
};
