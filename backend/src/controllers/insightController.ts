import { Request, Response, NextFunction } from 'express';
import { insightService } from '../services/insightService';

export async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = await insightService.getOverview(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getMonthlyBreakdown(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = await insightService.getMonthlyBreakdown(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getWeeklyBreakdown(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = await insightService.getWeeklyBreakdown(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryBreakdown(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = await insightService.getCategoryBreakdown(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getRecent(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string, 10) || 10;

    const data = await insightService.getRecentTransactions(userId, limitNum);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getStatistics(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = await insightService.getStatistics(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCashflow(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = await insightService.getCashflow(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
