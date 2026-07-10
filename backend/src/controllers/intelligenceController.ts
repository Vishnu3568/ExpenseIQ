import { Request, Response } from 'express';
import QueryBuilderService from '../services/QueryBuilderService';
import ComparisonService from '../services/ComparisonService';
import SavedViewService from '../services/SavedViewService';
import SearchHistoryService from '../services/SearchHistoryService';
import prisma from '../db';
import { domainEventService } from '../services/DomainEventService';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    currency: string;
  };
}

export const searchTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const result = await QueryBuilderService.search(userId, req.body);

    // Save to search history if a search term was provided
    if (req.body.searchTerm && req.body.searchTerm.trim() !== '') {
      await SearchHistoryService.addSearch(userId, req.body.searchTerm);
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Search execution failed' });
  }
};

export const compareMetrics = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const result = await ComparisonService.compare(userId, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Comparison failed' });
  }
};

export const performBulkOperations = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const { ids, action, categoryId } = req.body;

    // 1. Verify ownership of all transaction IDs to prevent permission exploits
    const transactions = await prisma.transaction.findMany({
      where: {
        id: { in: ids },
        userId,
      },
    });

    if (transactions.length !== ids.length) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: One or more selected transaction IDs do not exist or belong to another account.',
      });
    }

    // 2. Perform target bulk action
    switch (action) {
      case 'DELETE':
        await prisma.transaction.deleteMany({
          where: { id: { in: ids } },
        });
        domainEventService.publish('TRANSACTIONS_BULK_DELETED', {
          userId,
          transactionIds: ids,
          count: ids.length,
        });
        return res.status(200).json({
          success: true,
          message: `Successfully deleted ${ids.length} transactions.`,
        });

      case 'CATEGORY': {
        if (!categoryId) {
          return res.status(400).json({ success: false, message: 'categoryId is required for CATEGORY action' });
        }
        // Verify target category exists and belongs to the user or is a system category (userId === null)
        const targetCategory = await prisma.category.findFirst({
          where: {
            id: categoryId,
            OR: [{ userId }, { userId: null }],
          },
        });
        if (!targetCategory) {
          return res.status(404).json({ success: false, message: 'Target category not found' });
        }
        await prisma.transaction.updateMany({
          where: { id: { in: ids } },
          data: { categoryId },
        });
        domainEventService.publish('TRANSACTIONS_BULK_UPDATED', {
          userId,
          transactionIds: ids,
          count: ids.length,
        });
        return res.status(200).json({
          success: true,
          message: `Successfully updated category to "${targetCategory.name}" for ${ids.length} transactions.`,
        });
      }

      case 'ARCHIVE': {
        // Soft-archive transaction categories
        const archiveCategoryIds = transactions
          .map((t) => t.categoryId)
          .filter(Boolean) as string[];
        if (archiveCategoryIds.length > 0) {
          await prisma.category.updateMany({
            where: { id: { in: archiveCategoryIds }, userId },
            data: { isActive: false },
          });
        }
        return res.status(200).json({
          success: true,
          message: `Successfully archived linked categories for ${ids.length} transactions.`,
        });
      }

      case 'RESTORE': {
        // Restore archived categories
        const restoreCategoryIds = transactions
          .map((t) => t.categoryId)
          .filter(Boolean) as string[];
        if (restoreCategoryIds.length > 0) {
          await prisma.category.updateMany({
            where: { id: { in: restoreCategoryIds }, userId },
            data: { isActive: true },
          });
        }
        return res.status(200).json({
          success: true,
          message: `Successfully restored linked categories for ${ids.length} transactions.`,
        });
      }

      case 'EXPORT':
        // Return full details to let frontend generate download file
        return res.status(200).json({
          success: true,
          message: 'Bulk export details retrieved.',
          data: transactions,
        });

      default:
        return res.status(400).json({ success: false, message: `Unsupported action: ${action}` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Bulk operation failed' });
  }
};

export const saveView = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const view = await SavedViewService.createView(userId, req.body);
    domainEventService.publish('SAVED_VIEW_CREATED', {
      userId,
      savedViewId: view.id,
      name: view.name,
    });
    res.status(201).json({ success: true, data: view });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to save view' });
  }
};

export const getSavedViews = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const list = await SavedViewService.listViews(userId);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to list saved views' });
  }
};

export const updateSavedView = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const { id } = req.params;
    const updated = await SavedViewService.updateView(id, userId, req.body);
    domainEventService.publish('SAVED_VIEW_UPDATED', {
      userId,
      savedViewId: updated.id,
      name: updated.name,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to update saved view' });
  }
};

export const deleteSavedView = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const { id } = req.params;
    const view = await prisma.savedView.findFirst({ where: { id, userId } });
    await SavedViewService.deleteView(id, userId);
    if (view) {
      domainEventService.publish('SAVED_VIEW_DELETED', {
        userId,
        savedViewId: id,
        name: view.name,
      });
    }
    res.status(200).json({ success: true, message: 'Saved view deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to delete saved view' });
  }
};

export const getSearchHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const history = await SearchHistoryService.getHistory(userId);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to fetch search history' });
  }
};

export const clearSearchHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    await SearchHistoryService.clearHistory(userId);
    res.status(200).json({ success: true, message: 'Search history cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to clear search history' });
  }
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    // Fetch in parallel for suggestions mapping
    const [recentSearches, categories, distinctTitles, distinctMethods] = await Promise.all([
      SearchHistoryService.getHistory(userId),
      prisma.category.findMany({
        where: { OR: [{ userId }, { userId: null }], isActive: true },
        select: { id: true, name: true, type: true, color: true },
        orderBy: { name: 'asc' },
      }),
      prisma.transaction.findMany({
        where: { userId },
        distinct: ['title'],
        select: { title: true },
        orderBy: { title: 'asc' },
        take: 10,
      }),
      prisma.transaction.findMany({
        where: { userId },
        distinct: ['paymentMethod'],
        select: { paymentMethod: true },
        orderBy: { paymentMethod: 'asc' },
        take: 5,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentSearches: recentSearches.map((r) => r.query),
        categories,
        titles: distinctTitles.map((t) => t.title),
        paymentMethods: distinctMethods.map((m) => m.paymentMethod),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message || 'Failed to fetch suggestions' });
  }
};
