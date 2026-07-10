import { Request, Response, NextFunction } from 'express';
import { ReportBuilder } from '../services/ReportBuilder';
import { ReportHistoryService } from '../services/ReportHistoryService';
import { ExportService } from '../services/ExportService';
import { domainEventService } from '../services/DomainEventService';

export async function generatePreview(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, type, filters, template } = req.body;
    const reportData = await ReportBuilder.buildReportData(
      userId,
      name || 'Preview Report',
      type,
      filters || {},
      template || 'professional'
    );

    return res.status(200).json({ success: true, data: reportData });
  } catch (err) {
    next(err);
  }
}

export async function saveReport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, type, filters, template } = req.body;
    const report = await ReportHistoryService.saveReport(
      userId,
      name,
      type,
      filters || {},
      template || 'professional'
    );

    domainEventService.publish('REPORT_GENERATED', {
      userId,
      reportId: report.id,
      name: report.name,
      type: report.type,
    });

    return res.status(201).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

export async function getReportsHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const history = await ReportHistoryService.getReportsHistory(userId);
    return res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
}

export async function getReportDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // 1. Fetch saved metadata
    const reportMeta = await ReportHistoryService.getReportById(id, userId);

    // 2. Generate current data live using saved configurations
    const reportData = await ReportBuilder.buildReportData(
      userId,
      reportMeta.name,
      reportMeta.type,
      reportMeta.filters,
      reportMeta.template
    );

    // Return merged response
    return res.status(200).json({
      success: true,
      data: {
        ...reportData,
        id: reportMeta.id,
      },
    });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any).message && (err as any).message.includes('not found')) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    next(err);
  }
}

export async function exportReportFile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id, format } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!['pdf', 'csv', 'excel', 'html'].includes(format)) {
      return res.status(400).json({ success: false, message: 'Invalid export format' });
    }

    // 1. Fetch configuration details
    const reportMeta = await ReportHistoryService.getReportById(id, userId);

    // 2. Build metrics data
    const reportData = await ReportBuilder.buildReportData(
      userId,
      reportMeta.name,
      reportMeta.type,
      reportMeta.filters,
      reportMeta.template
    );

    // 3. Export to requested format
    const { content, mimeType, filename } = await ExportService.exportReport(
      reportData,
      format as 'pdf' | 'csv' | 'excel' | 'html'
    );

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    domainEventService.publish('REPORT_EXPORTED', {
      userId,
      name: reportMeta.name,
      format,
    });

    return res.send(content);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any).message && (err as any).message.includes('not found')) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    next(err);
  }
}

export async function deleteReport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const report = await ReportHistoryService.getReportById(id, userId).catch(() => null);
    await ReportHistoryService.deleteReport(id, userId);
    if (report) {
      domainEventService.publish('REPORT_DELETED', {
        userId,
        reportId: id,
        name: report.name,
      });
    }
    return res.status(200).json({ success: true, message: 'Report removed from history successfully' });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any).message && (err as any).message.includes('not found')) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    next(err);
  }
}
