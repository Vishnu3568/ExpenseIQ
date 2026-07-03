import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../db';

/**
 * Retrieve paginated, sorted, and filtered transactions alongside aggregate metrics.
 */
export async function getTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      page = '1',
      limit = '10',
      type,
      categoryId,
      paymentMethod,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      sortDir = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // 1. Construct Where Filters
    const whereClause: Prisma.TransactionWhereInput = {
      userId,
    };

    if (type === 'INCOME' || type === 'EXPENSE') {
      whereClause.type = type;
    }

    if (categoryId && typeof categoryId === 'string') {
      whereClause.categoryId = categoryId;
    }

    if (paymentMethod && typeof paymentMethod === 'string') {
      whereClause.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate && typeof startDate === 'string') {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate && typeof endDate === 'string') {
        whereClause.date.lte = new Date(endDate);
      }
    }

    if (search && typeof search === 'string') {
      whereClause.AND = [
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    // 2. Fetch Paginated Records
    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy as string]: sortDir as Prisma.SortOrder,
        },
        include: {
          category: {
            select: {
              name: true,
              color: true,
              icon: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where: whereClause }),
    ]);

    // 3. Compute Aggregate Totals (Income vs Expense)
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

    // 4. Compute Month Count
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const thisMonthCount = await prisma.transaction.count({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return res.status(200).json({
      success: true,
      transactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        thisMonthCount,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
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

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    return res.status(200).json({
      success: true,
      transaction,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new transaction
 */
export async function createTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { title, description, amount, type, categoryId, date, paymentMethod, notes } = req.body;

    // Cross-validate Category
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Referenced category does not exist',
        });
      }

      // Enforce ownership
      if (category.userId !== null && category.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to referenced category',
        });
      }

      // Enforce matching types
      if (category.type !== type) {
        return res.status(400).json({
          success: false,
          message: `Category type '${category.type}' does not match transaction type '${type}'`,
        });
      }

      // Enforce active status
      if (!category.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot record transaction against an archived category',
        });
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        amount: new Prisma.Decimal(amount),
        type,
        categoryId: categoryId || null,
        date: new Date(date),
        paymentMethod,
        notes: notes?.trim() || null,
      },
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

    return res.status(201).json({
      success: true,
      transaction,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update transaction details
 */
export async function updateTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, amount, type, categoryId, date, paymentMethod, notes } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Cross-validate Category if updated
    if (categoryId && categoryId !== transaction.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Referenced category does not exist',
        });
      }

      if (category.userId !== null && category.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to referenced category',
        });
      }

      if (category.type !== (type || transaction.type)) {
        return res.status(400).json({
          success: false,
          message: `Category type '${category.type}' does not match transaction type '${type || transaction.type}'`,
        });
      }

      if (!category.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot record transaction against an archived category',
        });
      }
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        title: title ? title.trim() : transaction.title,
        description: description !== undefined ? (description?.trim() || null) : transaction.description,
        amount: amount !== undefined ? new Prisma.Decimal(amount) : transaction.amount,
        type: type || transaction.type,
        categoryId: categoryId === null ? null : (categoryId || transaction.categoryId),
        date: date ? new Date(date) : transaction.date,
        paymentMethod: paymentMethod || transaction.paymentMethod,
        notes: notes !== undefined ? (notes?.trim() || null) : transaction.notes,
      },
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

    return res.status(200).json({
      success: true,
      transaction: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}
