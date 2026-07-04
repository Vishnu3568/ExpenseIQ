import * as ExcelJS from 'exceljs';
import { ReportDetails } from '../types/report';

export const ExcelExporter = {
  /**
   * Generates an Excel Workbook buffer for report details
   */
  async exportToExcel(report: ReportDetails): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ExpenseIQ';
    workbook.lastModifiedBy = 'ExpenseIQ';
    workbook.created = new Date();
    workbook.modified = new Date();

    // ----------------------------------------------------
    // Tab 1: Summary Dashboard
    // ----------------------------------------------------
    const summarySheet = workbook.addWorksheet('Summary Dashboard', {
      views: [{ showGridLines: true }],
    });

    // Style helper colors
    const primaryColor = '4F46E5'; // Indigo
    const grayHeaderBg = 'F1F5F9'; // slate-100

    // Title Row
    summarySheet.mergeCells('A1:C1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = report.name;
    titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: primaryColor },
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    summarySheet.getRow(1).height = 40;

    // Metadata details
    summarySheet.getCell('A3').value = 'User Name:';
    summarySheet.getCell('A3').font = { bold: true };
    summarySheet.getCell('B3').value = report.userName;

    summarySheet.getCell('A4').value = 'Generated At:';
    summarySheet.getCell('A4').font = { bold: true };
    summarySheet.getCell('B4').value = new Date(report.generatedAt).toLocaleString();

    summarySheet.getCell('A5').value = 'Report Type:';
    summarySheet.getCell('A5').font = { bold: true };
    summarySheet.getCell('B5').value = report.type;

    summarySheet.getCell('A6').value = 'Version:';
    summarySheet.getCell('A6').font = { bold: true };
    summarySheet.getCell('B6').value = report.version;

    // Metrics Table Header
    summarySheet.getCell('A8').value = 'Key Performance Metric';
    summarySheet.getCell('B8').value = 'Report Value';
    summarySheet.getRow(8).font = { bold: true };
    summarySheet.getRow(8).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: grayHeaderBg },
    };

    const s = report.summary;
    const metricsData = [
      { name: 'Total Income', val: s.totalIncome, format: '$#,##0.00' },
      { name: 'Total Expense', val: s.totalExpense, format: '$#,##0.00' },
      { name: 'Net Balance', val: s.netBalance, format: '$#,##0.00' },
      { name: 'Savings Rate', val: s.savingsRate / 100, format: '0.0%' },
      { name: 'Largest Income', val: s.largestIncome, format: '$#,##0.00' },
      { name: 'Largest Expense', val: s.largestExpense, format: '$#,##0.00' },
      { name: 'Average Daily Spend', val: s.averageDailySpend, format: '$#,##0.00' },
      { name: 'Average Monthly Spend', val: s.averageMonthlySpend, format: '$#,##0.00' },
      { name: 'Budget Utilization', val: s.budgetUtilization / 100, format: '0.0%' },
      { name: 'Overspending Categories Count', val: s.overspendingCategoriesCount, format: '0' },
      { name: 'Transaction Count', val: s.transactionCount, format: '0' },
    ];

    let rowIdx = 9;
    for (const metric of metricsData) {
      const nameCell = summarySheet.getCell(`A${rowIdx}`);
      const valCell = summarySheet.getCell(`B${rowIdx}`);

      nameCell.value = metric.name;
      valCell.value = metric.val;
      valCell.numFmt = metric.format;
      valCell.alignment = { horizontal: 'right' };

      // Highlight Net Balance
      if (metric.name === 'Net Balance') {
        const balanceColor = s.netBalance >= 0 ? 'DCFCE7' : 'FEE2E2'; // light green / red
        nameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: balanceColor } };
        valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: balanceColor } };
        nameCell.font = { bold: true };
        valCell.font = { bold: true };
      }

      rowIdx++;
    }

    summarySheet.getColumn('A').width = 32;
    summarySheet.getColumn('B').width = 18;

    // ----------------------------------------------------
    // Tab 2: Category Breakdown
    // ----------------------------------------------------
    const catSheet = workbook.addWorksheet('Category Breakdown');
    catSheet.columns = [
      { header: 'Category Name', key: 'name', width: 24 },
      { header: 'Type', key: 'type', width: 14 },
      { header: 'Total Amount', key: 'amount', width: 18 },
      { header: 'Percentage of Total', key: 'percentage', width: 20 },
      { header: 'Transaction Count', key: 'count', width: 18 },
    ];

    catSheet.getRow(1).font = { bold: true };
    catSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: grayHeaderBg },
    };

    for (const c of report.categoryBreakdown) {
      const row = catSheet.addRow({
        name: c.name,
        type: c.type,
        amount: c.amount,
        percentage: c.percentage / 100,
        count: c.count,
      });

      row.getCell('amount').numFmt = '$#,##0.00';
      row.getCell('percentage').numFmt = '0.0%';
      row.getCell('amount').alignment = { horizontal: 'right' };
      row.getCell('percentage').alignment = { horizontal: 'right' };
      row.getCell('count').alignment = { horizontal: 'right' };
    }

    // ----------------------------------------------------
    // Tab 3: Detailed Transactions
    // ----------------------------------------------------
    const txSheet = workbook.addWorksheet('Transactions Logs');
    txSheet.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Title', key: 'title', width: 28 },
      { header: 'Category', key: 'categoryName', width: 20 },
      { header: 'Type', key: 'type', width: 14 },
      { header: 'Amount', key: 'amount', width: 18 },
      { header: 'Payment Method', key: 'paymentMethod', width: 18 },
    ];

    txSheet.getRow(1).font = { bold: true };
    txSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: grayHeaderBg },
    };

    for (const t of report.transactions) {
      const row = txSheet.addRow({
        date: new Date(t.date).toLocaleDateString(),
        title: t.title,
        categoryName: t.categoryName,
        type: t.type,
        amount: t.amount,
        paymentMethod: t.paymentMethod,
      });

      row.getCell('amount').numFmt = '$#,##0.00';
      row.getCell('amount').alignment = { horizontal: 'right' };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  },
};
