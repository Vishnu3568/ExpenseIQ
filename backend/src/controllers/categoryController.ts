import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../db';

/**
 * Get all categories (system categories + authenticated user's custom categories)
 */
export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { type, status, search } = req.query;

    const whereClause: Prisma.CategoryWhereInput = {
      OR: [
        { userId: null },
        { userId: userId },
      ],
    };

    // Filter by type (INCOME or EXPENSE)
    if (type === 'INCOME' || type === 'EXPENSE') {
      whereClause.type = type;
    }

    // Filter by status (active, archived, or all)
    if (status === 'active') {
      whereClause.isActive = true;
    } else if (status === 'archived') {
      whereClause.isActive = false;
    }

    // Filter by search query (name or description)
    if (search && typeof search === 'string') {
      whereClause.AND = [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Enforce ownership: must be owned by the user or be a system category
    if (category.userId !== null && category.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a custom user category
 */
export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, description, type, color, icon, sortOrder } = req.body;

    // Check for duplicate category name within the same type (for user + system)
    const duplicate = await prisma.category.findFirst({
      where: {
        name: { equals: name.trim(), mode: 'insensitive' },
        type,
        OR: [
          { userId: null },
          { userId },
        ],
      },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists for this type',
      });
    }

    const category = await prisma.category.create({
      data: {
        userId,
        name: name.trim(),
        description: description?.trim() || null,
        type,
        color,
        icon,
        sortOrder: sortOrder || 0,
        isActive: true,
      },
    });

    return res.status(201).json({
      success: true,
      category,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update custom category
 */
export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, description, type, color, icon, sortOrder } = req.body;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Block modification of system categories
    if (category.userId === null) {
      return res.status(403).json({
        success: false,
        message: 'System categories cannot be modified',
      });
    }

    // Verify ownership
    if (category.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check for duplicate name if renaming
    if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const duplicate = await prisma.category.findFirst({
        where: {
          id: { not: id },
          name: { equals: name.trim(), mode: 'insensitive' },
          type: type || category.type,
          OR: [
            { userId: null },
            { userId },
          ],
        },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists for this type',
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name ? name.trim() : category.name,
        description: description !== undefined ? (description?.trim() || null) : category.description,
        type: type || category.type,
        color: color || category.color,
        icon: icon || category.icon,
        sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
      },
    });

    return res.status(200).json({
      success: true,
      category: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete custom category
 */
export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Block deletion of system categories
    if (category.userId === null) {
      return res.status(403).json({
        success: false,
        message: 'System categories cannot be deleted',
      });
    }

    // Verify ownership
    if (category.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Archive a custom category
 */
export async function archiveCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (category.userId === null) {
      return res.status(403).json({
        success: false,
        message: 'System categories cannot be archived',
      });
    }

    if (category.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return res.status(200).json({
      success: true,
      category: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Restore an archived custom category
 */
export async function restoreCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (category.userId === null) {
      return res.status(403).json({
        success: false,
        message: 'System categories cannot be modified',
      });
    }

    if (category.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { isActive: true },
    });

    return res.status(200).json({
      success: true,
      category: updated,
    });
  } catch (err) {
    next(err);
  }
}
