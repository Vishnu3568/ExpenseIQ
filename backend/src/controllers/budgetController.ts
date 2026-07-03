import { Request, Response, NextFunction } from 'express';
import { budgetService } from '../services/budgetService';

export async function getBudgets(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const budgets = await budgetService.getAllBudgets(userId);
    return res.status(200).json({ success: true, data: budgets });
  } catch (err) {
    next(err);
  }
}

export async function getBudgetById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const budget = await budgetService.getBudgetById(id, userId);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    return res.status(200).json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
}

export async function createBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const budget = await budgetService.createBudget(userId, req.body);
    return res.status(201).json({ success: true, data: budget });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errMsg = (err as any).message;
    if (errMsg && errMsg.includes('overlaps')) {
      return res.status(400).json({ success: false, message: errMsg });
    }
    next(err);
  }
}

export async function updateBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const budget = await budgetService.updateBudget(id, userId, req.body);
    return res.status(200).json({ success: true, data: budget });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errMsg = (err as any).message;
    if (errMsg && errMsg.includes('not found')) {
      return res.status(404).json({ success: false, message: errMsg });
    }
    next(err);
  }
}

export async function deleteBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await budgetService.deleteBudget(id, userId);
    return res.status(200).json({ success: true, message: 'Budget deleted successfully' });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errMsg = (err as any).message;
    if (errMsg && errMsg.includes('not found')) {
      return res.status(404).json({ success: false, message: errMsg });
    }
    next(err);
  }
}

export async function getBudgetsProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const progress = await budgetService.getBudgetsProgress(userId);
    return res.status(200).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
}

export async function getBudgetsOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const overview = await budgetService.getBudgetsOverview(userId);
    return res.status(200).json({ success: true, data: overview });
  } catch (err) {
    next(err);
  }
}
