import prisma from '../db';
import { Prisma } from '@prisma/client';
import { domainEventService } from './DomainEventService';

export interface AuditFilters {
  module?: string;
  action?: string;
  outcome?: 'SUCCESS' | 'FAILURE';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const auditService = {
  /**
   * Register event handlers on DomainEventService
   */
  init() {
    domainEventService.subscribe('AUTH_LOGIN_SUCCEEDED', async (payload) => {
      await this.logAudit({
        userId: payload.userId,
        action: 'AUTH_LOGIN_SUCCEEDED',
        module: 'AUTH',
        outcome: 'SUCCESS',
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      });
    });

    domainEventService.subscribe('AUTH_LOGIN_FAILED', async (payload) => {
      // Find user if exists
      const user = await prisma.user.findUnique({ where: { email: payload.email } }).catch(() => null);
      await this.logAudit({
        userId: user?.id || null,
        action: 'AUTH_LOGIN_FAILED',
        module: 'AUTH',
        outcome: 'FAILURE',
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        metadata: { email: payload.email, reason: payload.reason || 'Invalid credentials' },
      });
    });

    domainEventService.subscribe('AUTH_LOGOUT', async (payload) => {
      await this.logAudit({
        userId: payload.userId,
        action: 'AUTH_LOGOUT',
        module: 'AUTH',
        outcome: 'SUCCESS',
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      });
    });

    domainEventService.subscribe('PASSWORD_CHANGED', async (payload) => {
      await this.logAudit({
        userId: payload.userId,
        action: 'PASSWORD_CHANGED',
        module: 'AUTH',
        outcome: 'SUCCESS',
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      });
    });

    domainEventService.subscribe('EMAIL_CHANGED', async (payload) => {
      await this.logAudit({
        userId: payload.userId,
        action: 'EMAIL_CHANGED',
        module: 'AUTH',
        outcome: 'SUCCESS',
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        metadata: { oldEmail: payload.oldEmail, newEmail: payload.newEmail },
      });
    });

    domainEventService.subscribe('PROFILE_UPDATED', async (payload) => {
      await this.logAudit({
        userId: payload.userId,
        action: 'PROFILE_UPDATED',
        module: 'WORKSPACE',
        outcome: 'SUCCESS',
        metadata: { updatedFields: payload.updatedFields },
      });
    });

    domainEventService.subscribe('PERSONAL_DATA_EXPORTED', async (payload) => {
      await this.logAudit({
        userId: payload.userId,
        action: 'PERSONAL_DATA_EXPORTED',
        module: 'WORKSPACE',
        outcome: 'SUCCESS',
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      });
    });

    domainEventService.subscribe('ALL_TRANSACTIONS_DELETED', async (payload) => {
      await this.logAudit({
        userId: payload.userId,
        action: 'ALL_TRANSACTIONS_DELETED',
        module: 'WORKSPACE',
        outcome: 'SUCCESS',
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        metadata: { purgedCount: payload.count },
      });
    });

    domainEventService.subscribe('DEMO_DATA_RESET', async (payload) => {
      await this.logAudit({
        userId: payload.userId,
        action: 'DEMO_DATA_RESET',
        module: 'WORKSPACE',
        outcome: 'SUCCESS',
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      });
    });
  },

  async logAudit(data: {
    userId: string | null;
    action: string;
    module: string;
    outcome: 'SUCCESS' | 'FAILURE';
    ipAddress?: string;
    userAgent?: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }) {
    // Sanitize metadata to never store passwords or credentials
    const safeMetadata = { ...data.metadata };
    delete safeMetadata.password;
    delete safeMetadata.passwordHash;
    delete safeMetadata.token;
    delete safeMetadata.accessToken;
    delete safeMetadata.refreshToken;
    delete safeMetadata.cookie;
    delete safeMetadata.authorization;

    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        module: data.module,
        outcome: data.outcome,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: safeMetadata as Prisma.InputJsonValue,
      },
    });
  },

  async getAuditLogs(userId: string, filters: AuditFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = { userId };

    if (filters.module) {
      where.module = filters.module;
    }
    if (filters.action) {
      where.action = filters.action;
    }
    if (filters.outcome) {
      where.outcome = filters.outcome;
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
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
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

  async getAuditLogById(id: string, userId: string) {
    return prisma.auditLog.findFirst({
      where: { id, userId },
    });
  },
};

export default auditService;
