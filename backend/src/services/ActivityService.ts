import prisma from '../db';
import { Prisma } from '@prisma/client';
import { domainEventService } from './DomainEventService';

export interface ActivityFilters {
  module?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const activityService = {
  /**
   * Register event handlers on DomainEventService
   */
  init() {
    // 1. Transaction events
    domainEventService.subscribe('TRANSACTION_CREATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'TRANSACTION_CREATED',
        title: 'Transaction Logged',
        description: `Logged transaction "${payload.title}" of ${payload.currency} ${payload.amount}`,
        module: 'TRANSACTION',
        entityType: 'Transaction',
        entityId: payload.transactionId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('TRANSACTION_UPDATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'TRANSACTION_UPDATED',
        title: 'Transaction Updated',
        description: `Updated transaction "${payload.title}" of ${payload.currency} ${payload.amount}`,
        module: 'TRANSACTION',
        entityType: 'Transaction',
        entityId: payload.transactionId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('TRANSACTION_DELETED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'TRANSACTION_DELETED',
        title: 'Transaction Deleted',
        description: `Deleted transaction "${payload.title}" of ${payload.currency} ${payload.amount}`,
        module: 'TRANSACTION',
        entityType: 'Transaction',
        entityId: payload.transactionId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('TRANSACTIONS_BULK_UPDATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'TRANSACTIONS_BULK_UPDATED',
        title: 'Transactions Bulk Updated',
        description: `Bulk updated ${payload.count} transaction records`,
        module: 'TRANSACTION',
        metadata: payload,
      });
    });

    domainEventService.subscribe('TRANSACTIONS_BULK_DELETED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'TRANSACTIONS_BULK_DELETED',
        title: 'Transactions Bulk Deleted',
        description: `Bulk deleted ${payload.count} transaction records`,
        module: 'TRANSACTION',
        metadata: payload,
      });
    });

    // 2. Category events
    domainEventService.subscribe('CATEGORY_CREATED', async (payload) => {
      if (!payload.userId) return; // Skip default system categories
      await this.logActivity({
        userId: payload.userId,
        eventType: 'CATEGORY_CREATED',
        title: 'Category Created',
        description: `Created new ${payload.type.toLowerCase()} category "${payload.name}"`,
        module: 'CATEGORY',
        entityType: 'Category',
        entityId: payload.categoryId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('CATEGORY_UPDATED', async (payload) => {
      if (!payload.userId) return;
      await this.logActivity({
        userId: payload.userId,
        eventType: 'CATEGORY_UPDATED',
        title: 'Category Updated',
        description: `Modified category name to "${payload.name}"`,
        module: 'CATEGORY',
        entityType: 'Category',
        entityId: payload.categoryId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('CATEGORY_ARCHIVED', async (payload) => {
      if (!payload.userId) return;
      await this.logActivity({
        userId: payload.userId,
        eventType: 'CATEGORY_ARCHIVED',
        title: 'Category Archived',
        description: `Archived category "${payload.name}"`,
        module: 'CATEGORY',
        entityType: 'Category',
        entityId: payload.categoryId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('CATEGORY_RESTORED', async (payload) => {
      if (!payload.userId) return;
      await this.logActivity({
        userId: payload.userId,
        eventType: 'CATEGORY_RESTORED',
        title: 'Category Restored',
        description: `Restored archived category "${payload.name}"`,
        module: 'CATEGORY',
        entityType: 'Category',
        entityId: payload.categoryId,
        metadata: payload,
      });
    });

    // 3. Budget events
    domainEventService.subscribe('BUDGET_CREATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'BUDGET_CREATED',
        title: 'Budget Set',
        description: `Set limit of ${payload.amount} for budget "${payload.name}"`,
        module: 'BUDGET',
        entityType: 'Budget',
        entityId: payload.budgetId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('BUDGET_UPDATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'BUDGET_UPDATED',
        title: 'Budget Updated',
        description: `Updated budget "${payload.name}" limit to ${payload.amount}`,
        module: 'BUDGET',
        entityType: 'Budget',
        entityId: payload.budgetId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('BUDGET_DELETED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'BUDGET_DELETED',
        title: 'Budget Removed',
        description: `Removed budget limit for "${payload.name}"`,
        module: 'BUDGET',
        entityType: 'Budget',
        entityId: payload.budgetId,
        metadata: payload,
      });
    });

    // 4. Report events
    domainEventService.subscribe('REPORT_GENERATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'REPORT_GENERATED',
        title: 'Report Compiled',
        description: `Compiled new ${payload.type} report "${payload.name}"`,
        module: 'REPORT',
        entityType: 'Report',
        entityId: payload.reportId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('REPORT_EXPORTED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'REPORT_EXPORTED',
        title: 'Report Exported',
        description: `Exported report file "${payload.name}" to ${payload.format.toUpperCase()} format`,
        module: 'REPORT',
        metadata: payload,
      });
    });

    domainEventService.subscribe('REPORT_DELETED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'REPORT_DELETED',
        title: 'Report Removed',
        description: `Removed report history for "${payload.name}"`,
        module: 'REPORT',
        entityType: 'Report',
        entityId: payload.reportId,
        metadata: payload,
      });
    });

    // 5. Saved View events
    domainEventService.subscribe('SAVED_VIEW_CREATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'SAVED_VIEW_CREATED',
        title: 'Saved View Created',
        description: `Created quick filter preset view "${payload.name}"`,
        module: 'INTELLIGENCE',
        entityType: 'SavedView',
        entityId: payload.savedViewId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('SAVED_VIEW_UPDATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'SAVED_VIEW_UPDATED',
        title: 'Saved View Updated',
        description: `Updated quick filter preset view "${payload.name}"`,
        module: 'INTELLIGENCE',
        entityType: 'SavedView',
        entityId: payload.savedViewId,
        metadata: payload,
      });
    });

    domainEventService.subscribe('SAVED_VIEW_DELETED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'SAVED_VIEW_DELETED',
        title: 'Saved View Removed',
        description: `Removed filter preset view "${payload.name}"`,
        module: 'INTELLIGENCE',
        entityType: 'SavedView',
        entityId: payload.savedViewId,
        metadata: payload,
      });
    });

    // 6. Workspace preferences
    domainEventService.subscribe('WORKSPACE_PREFERENCES_UPDATED', async (payload) => {
      await this.logActivity({
        userId: payload.userId,
        eventType: 'WORKSPACE_PREFERENCES_UPDATED',
        title: 'Preferences Updated',
        description: 'Updated workspace regional settings and formatting layout options',
        module: 'WORKSPACE',
        metadata: payload,
      });
    });
  },

  async logActivity(data: {
    userId: string;
    eventType: string;
    title: string;
    description: string;
    module: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }) {
    return prisma.activityEvent.create({
      data: {
        userId: data.userId,
        eventType: data.eventType,
        title: data.title,
        description: data.description,
        module: data.module,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata as Prisma.InputJsonValue,
      },
    });
  },

  async getActivities(userId: string, filters: ActivityFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityEventWhereInput = { userId };

    if (filters.module) {
      where.module = filters.module;
    }
    if (filters.eventType) {
      where.eventType = filters.eventType;
    }
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    const [items, total] = await Promise.all([
      prisma.activityEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activityEvent.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getActivityById(id: string, userId: string) {
    return prisma.activityEvent.findFirst({
      where: { id, userId },
    });
  },
};

export default activityService;
