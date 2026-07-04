import { Prisma } from '@prisma/client';
import prisma from '../db';
import { ReportFilter } from '../types/report';

export const ReportHistoryService = {
  /**
   * Saves a report configuration to history
   */
  async saveReport(
    userId: string,
    name: string,
    type: string,
    filters: ReportFilter,
    template: string = 'professional'
  ) {
    // Construct default descriptive name if empty
    const reportName = name.trim() || `${type.charAt(0) + type.slice(1).toLowerCase()} Report - ${new Date().toLocaleDateString()}`;

    const report = await prisma.report.create({
      data: {
        userId,
        name: reportName,
        type,
        filters: filters as unknown as Prisma.InputJsonValue,
        template,
      },
    });

    return report;
  },

  /**
   * Retrieves all saved report logs for a user
   */
  async getReportsHistory(userId: string) {
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return reports.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      filters: r.filters as unknown as ReportFilter,
      template: r.template,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  },

  /**
   * Fetches a single report metadata, checking ownership
   */
  async getReportById(id: string, userId: string) {
    const report = await prisma.report.findFirst({
      where: { id, userId },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    return {
      id: report.id,
      name: report.name,
      type: report.type,
      filters: report.filters as unknown as ReportFilter,
      template: report.template,
      createdAt: report.createdAt.toISOString(),
    };
  },

  /**
   * Deletes a saved report configuration from history
   */
  async deleteReport(id: string, userId: string) {
    const report = await prisma.report.findFirst({
      where: { id, userId },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    await prisma.report.delete({
      where: { id },
    });

    return true;
  },
};
