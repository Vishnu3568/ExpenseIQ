import { Prisma } from '@prisma/client';
import prisma from '../db';
import {
  DashboardPreferences,
  ExportPreferences,
  NotificationPreferences,
} from '../types/workspace';

// Default Preference Presets
const DEFAULT_DASHBOARD: DashboardPreferences = {
  defaultLandingPage: '/dashboard',
  favoriteWidgets: ['net-worth', 'monthly-budget', 'cash-flow-chart'],
  compactMode: false,
  sidebarCollapsed: false,
  chartAnimations: true,
  density: 'COMFORTABLE',
};

const DEFAULT_EXPORT: ExportPreferences = {
  preferredPdfTemplate: 'clean-modern',
  preferredCsvDelimiter: ',',
  excelFormatting: true,
  defaultReportTemplate: 'standard-summary',
};

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  budgetAlerts: true,
  weeklySummary: true,
  monthlySummary: true,
  securityAlerts: true,
  productAnnouncements: false,
  emailNotifications: true,
  pushNotifications: false,
};

export class WorkspaceService {
  /**
   * Lazily loads or creates default settings for a given user.
   */
  static async getOrCreateWorkspace(userId: string) {
    let ws = await prisma.workspace.findUnique({
      where: { userId },
    });

    if (!ws) {
      ws = await prisma.workspace.create({
        data: {
          userId,
          currency: 'USD',
          timezone: 'UTC',
          locale: 'en-US',
          numberFormat: 'COMMA',
          dateFormat: 'YYYY-MM-DD',
          theme: 'system',
          dashboardPreferences: DEFAULT_DASHBOARD as unknown as Prisma.InputJsonValue,
          exportPreferences: DEFAULT_EXPORT as unknown as Prisma.InputJsonValue,
          notificationPreferences: DEFAULT_NOTIFICATIONS as unknown as Prisma.InputJsonValue,
        },
      });
    }
    return ws;
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { workspace: true },
    });

    if (!user) throw new Error('User not found');
    const ws = await this.getOrCreateWorkspace(userId);

    return {
      fullName: user.name,
      email: user.email,
      phoneNumber: ws.phoneNumber || '',
      bio: ws.bio || '',
      avatarUrl: ws.avatarUrl || '',
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: ws.lastLoginAt.toISOString(),
      passwordChangedAt: ws.passwordChangedAt.toISOString(),
    };
  }

  static async updateProfile(
    userId: string,
    data: { name: string; email: string; phoneNumber?: string; bio?: string; avatarUrl?: string }
  ) {
    // Ensure email uniqueness if changing
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing && existing.id !== userId) {
      throw new Error('Email address is already in use by another account');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    await prisma.workspace.update({
      where: { userId },
      data: {
        phoneNumber: data.phoneNumber,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
    });

    return this.getProfile(userId);
  }

  static async updatePassword(userId: string, passwordHash: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await prisma.workspace.update({
      where: { userId },
      data: { passwordChangedAt: new Date() },
    });
  }

  static async getPreferences(userId: string) {
    const ws = await this.getOrCreateWorkspace(userId);
    return {
      currency: ws.currency,
      timezone: ws.timezone,
      locale: ws.locale,
      numberFormat: ws.numberFormat,
      dateFormat: ws.dateFormat,
    };
  }

  static async updatePreferences(
    userId: string,
    data: { currency: string; timezone: string; locale: string; numberFormat: string; dateFormat: string }
  ) {
    const ws = await prisma.workspace.update({
      where: { userId },
      data: {
        currency: data.currency,
        timezone: data.timezone,
        locale: data.locale,
        numberFormat: data.numberFormat,
        dateFormat: data.dateFormat,
      },
    });

    // Sync user.currency if changed (as fallback for pre-existing features)
    await prisma.user.update({
      where: { id: userId },
      data: { currency: data.currency },
    });

    return ws;
  }

  static async getTheme(userId: string) {
    const ws = await this.getOrCreateWorkspace(userId);
    return { theme: ws.theme };
  }

  static async updateTheme(userId: string, theme: string) {
    return prisma.workspace.update({
      where: { userId },
      data: { theme },
      select: { theme: true },
    });
  }

  static async getDashboard(userId: string) {
    const ws = await this.getOrCreateWorkspace(userId);
    return ws.dashboardPreferences as unknown as DashboardPreferences;
  }

  static async updateDashboard(userId: string, data: DashboardPreferences) {
    return prisma.workspace.update({
      where: { userId },
      data: { dashboardPreferences: data as unknown as Prisma.InputJsonValue },
    });
  }

  static async getExport(userId: string) {
    const ws = await this.getOrCreateWorkspace(userId);
    return ws.exportPreferences as unknown as ExportPreferences;
  }

  static async updateExport(userId: string, data: ExportPreferences) {
    return prisma.workspace.update({
      where: { userId },
      data: { exportPreferences: data as unknown as Prisma.InputJsonValue },
    });
  }

  static async getNotifications(userId: string) {
    const ws = await this.getOrCreateWorkspace(userId);
    return ws.notificationPreferences as unknown as NotificationPreferences;
  }

  static async updateNotifications(userId: string, data: NotificationPreferences) {
    return prisma.workspace.update({
      where: { userId },
      data: { notificationPreferences: data as unknown as Prisma.InputJsonValue },
    });
  }

  static async getSecurity(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    const ws = await this.getOrCreateWorkspace(userId);

    return {
      lastLogin: ws.lastLoginAt.toISOString(),
      accountCreated: user.createdAt.toISOString(),
      passwordUpdated: ws.passwordChangedAt.toISOString(),
      currentSession: {
        ip: '127.0.0.1', // Mock info
        device: 'Google Chrome / Windows OS',
        status: 'Active',
      },
      recentSessions: [
        {
          id: '1',
          ip: '127.0.0.1',
          device: 'Chrome / Windows',
          date: new Date(Date.now() - 3600000).toISOString(),
          status: 'Expired',
        },
        {
          id: '2',
          ip: '192.168.1.5',
          device: 'Safari / iPhone 15',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'Expired',
        },
      ],
    };
  }

  static async deleteAccount(userId: string) {
    // Due to Cascade constraints in schema.prisma, this will delete everything
    await prisma.user.delete({ where: { id: userId } });
  }

  static async purgeTransactions(userId: string) {
    await prisma.transaction.deleteMany({
      where: { userId },
    });
  }

  static async resetDemoData(userId: string) {
    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { userId } }),
      prisma.budget.deleteMany({ where: { userId } }),
      prisma.category.deleteMany({ where: { userId } }),
    ]);

    // Query standard system categories
    const systemCategories = await prisma.category.findMany({
      where: { userId: null },
    });

    let foodCat = systemCategories.find((c) => c.name === 'Food');
    let rentCat = systemCategories.find((c) => c.name === 'Rent');
    let salaryCat = systemCategories.find((c) => c.name === 'Salary');

    // Create if missing
    if (!foodCat) {
      foodCat = await prisma.category.create({
        data: { name: 'Food', type: 'EXPENSE', color: '#EF4444' },
      });
    }
    if (!rentCat) {
      rentCat = await prisma.category.create({
        data: { name: 'Rent', type: 'EXPENSE', color: '#3B82F6' },
      });
    }
    if (!salaryCat) {
      salaryCat = await prisma.category.create({
        data: { name: 'Salary', type: 'INCOME', color: '#10B981' },
      });
    }

    // Insert sample ledger records
    const today = new Date();
    await prisma.transaction.createMany({
      data: [
        {
          userId,
          title: 'Monthly Salary Paycheck',
          amount: 5000,
          type: 'INCOME',
          date: new Date(today.getFullYear(), today.getMonth(), 1),
          paymentMethod: 'Bank Transfer',
          categoryId: salaryCat.id,
        },
        {
          userId,
          title: 'Apartment Rent Payment',
          amount: 1500,
          type: 'EXPENSE',
          date: new Date(today.getFullYear(), today.getMonth(), 2),
          paymentMethod: 'Bank Transfer',
          categoryId: rentCat.id,
        },
        {
          userId,
          title: 'Grocery Shopping',
          amount: 120.5,
          type: 'EXPENSE',
          date: new Date(today.getFullYear(), today.getMonth(), 5),
          paymentMethod: 'Credit Card',
          categoryId: foodCat.id,
        },
        {
          userId,
          title: 'Dinner at Italian Restaurant',
          amount: 75.25,
          type: 'EXPENSE',
          date: new Date(today.getFullYear(), today.getMonth(), 8),
          paymentMethod: 'Credit Card',
          categoryId: foodCat.id,
        },
      ],
    });

    // Create a demo budget limits record
    await prisma.budget.create({
      data: {
        userId,
        name: 'Monthly Dining Out Limit',
        amount: 300,
        type: 'CATEGORY',
        categoryId: foodCat.id,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth(), 28),
      },
    });
  }

  static async exportPersonalData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspace: true,
        categories: true,
        transactions: true,
        budgets: true,
        reports: true,
        savedViews: true,
        tags: true,
      },
    });

    if (!user) throw new Error('User not found');

    return {
      exporter: 'ExpenseIQ Personal Data Engine',
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currency: user.currency,
        createdAt: user.createdAt.toISOString(),
      },
      workspace: user.workspace ? {
        phoneNumber: user.workspace.phoneNumber,
        bio: user.workspace.bio,
        avatarUrl: user.workspace.avatarUrl,
        timezone: user.workspace.timezone,
        locale: user.workspace.locale,
        numberFormat: user.workspace.numberFormat,
        dateFormat: user.workspace.dateFormat,
        theme: user.workspace.theme,
        dashboardPreferences: user.workspace.dashboardPreferences,
        exportPreferences: user.workspace.exportPreferences,
        notificationPreferences: user.workspace.notificationPreferences,
      } : null,
      categories: user.categories.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        color: c.color,
        isSystem: c.userId === null,
        isActive: c.isActive,
      })),
      transactions: user.transactions.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        amount: Number(t.amount),
        type: t.type,
        date: t.date.toISOString(),
        paymentMethod: t.paymentMethod,
        notes: t.notes,
        categoryId: t.categoryId,
      })),
      budgets: user.budgets.map((b) => ({
        id: b.id,
        name: b.name,
        amount: Number(b.amount),
        type: b.type,
        categoryId: b.categoryId,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
      })),
      savedViews: user.savedViews.map((s) => ({
        name: s.name,
        filters: s.filters,
        isFavorite: s.isFavorite,
      })),
      tags: user.tags.map((tg) => ({
        id: tg.id,
        name: tg.name,
        color: tg.color,
      })),
    };
  }
}
export default WorkspaceService;
