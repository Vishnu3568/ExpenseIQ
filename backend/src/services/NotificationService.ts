import prisma from '../db';
import { Prisma } from '@prisma/client';

export interface NotificationFilters {
  status?: 'UNREAD' | 'READ' | 'ARCHIVED';
  type?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const notificationService = {
  async getNotifications(userId: string, filters: NotificationFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.priority) {
      where.priority = filters.priority;
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

    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.notification.count({ where }),
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

  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { userId, status: 'UNREAD' },
    });
    return { count };
  },

  async getNotificationById(id: string, userId: string) {
    return prisma.notification.findFirst({
      where: { id, userId },
    });
  },

  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
    source?: string;
    entityType?: string;
    entityId?: string;
    actionUrl?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority,
        status: 'UNREAD',
        source: data.source,
        entityType: data.entityType,
        entityId: data.entityId,
        actionUrl: data.actionUrl,
        metadata: data.metadata as Prisma.InputJsonValue,
      },
    });
  },

  async markAsRead(id: string, userId: string) {
    // Confirm ownership
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }

    return prisma.notification.update({
      where: { id },
      data: { status: 'READ', readAt: new Date() },
    });
  },

  async markAsUnread(id: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }

    return prisma.notification.update({
      where: { id },
      data: { status: 'UNREAD', readAt: null },
    });
  },

  async archiveNotification(id: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }

    return prisma.notification.update({
      where: { id },
      data: { status: 'ARCHIVED', archivedAt: new Date() },
    });
  },

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, status: 'UNREAD' },
      data: { status: 'READ', readAt: new Date() },
    });
  },

  async archiveAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, status: 'READ' },
      data: { status: 'ARCHIVED', archivedAt: new Date() },
    });
  },

  async deleteNotification(id: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }

    await prisma.notification.delete({
      where: { id },
    });
    return true;
  },
};

export default notificationService;
