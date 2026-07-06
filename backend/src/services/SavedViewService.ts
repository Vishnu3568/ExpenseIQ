import { Prisma } from '@prisma/client';
import prisma from '../db';
import { SavedViewPayload, QueryGroup } from '../types/intelligence';

export const SavedViewService = {
  /**
   * Save a new view configuration
   */
  async createView(userId: string, payload: SavedViewPayload) {
    const { name, filters, isFavorite } = payload;
    const viewName = name.trim();

    // Check if duplicate name already exists
    const existing = await prisma.savedView.findUnique({
      where: {
        userId_name: { userId, name: viewName },
      },
    });

    if (existing) {
      throw new Error('A saved view with this name already exists.');
    }

    const savedView = await prisma.savedView.create({
      data: {
        userId,
        name: viewName,
        filters: filters as unknown as Prisma.InputJsonValue,
        isFavorite: isFavorite || false,
      },
    });

    return savedView;
  },

  /**
   * List all saved views for a user
   */
  async listViews(userId: string) {
    const views = await prisma.savedView.findMany({
      where: { userId },
      orderBy: [
        { isFavorite: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    return views.map((v) => ({
      id: v.id,
      name: v.name,
      filters: v.filters as unknown as QueryGroup,
      isFavorite: v.isFavorite,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    }));
  },

  /**
   * Update saved view properties (rename / toggle favorite)
   */
  async updateView(id: string, userId: string, payload: { name?: string; isFavorite?: boolean }) {
    const view = await prisma.savedView.findFirst({
      where: { id, userId },
    });

    if (!view) {
      throw new Error('Saved view not found');
    }

    const data: Prisma.SavedViewUpdateInput = {};
    if (payload.name !== undefined) {
      const newName = payload.name.trim();
      // Check if duplicate name exists for another record
      const duplicate = await prisma.savedView.findFirst({
        where: {
          userId,
          name: newName,
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new Error('A saved view with this name already exists.');
      }
      data.name = newName;
    }
    if (payload.isFavorite !== undefined) {
      data.isFavorite = payload.isFavorite;
    }

    const updated = await prisma.savedView.update({
      where: { id },
      data,
    });

    return {
      id: updated.id,
      name: updated.name,
      filters: updated.filters as unknown as QueryGroup,
      isFavorite: updated.isFavorite,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  },

  /**
   * Delete a saved view configuration
   */
  async deleteView(id: string, userId: string) {
    const view = await prisma.savedView.findFirst({
      where: { id, userId },
    });

    if (!view) {
      throw new Error('Saved view not found');
    }

    await prisma.savedView.delete({
      where: { id },
    });

    return true;
  },
};
export default SavedViewService;
