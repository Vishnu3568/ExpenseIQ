import { ReportDetails } from '../types/report';

export const CSVExporter = {
  /**
   * Formats report details as a CSV string
   */
  exportToCSV(report: ReportDetails): string {
    const rows: string[] = [];

    // Helper to escape CSV values safely
    const escape = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    // 1. Report Metadata Header
    rows.push(`"Report Title",${escape(report.name)}`);
    rows.push(`"User Name",${escape(report.userName)}`);
    rows.push(`"Generated Date & Time",${escape(new Date(report.generatedAt).toLocaleString())}`);
    rows.push(`"Report Type",${escape(report.type)}`);
    rows.push(`"Report Version",${escape(report.version)}`);
    rows.push(''); // Empty separator

    // 2. Summary Metrics
    rows.push('"SUMMARY METRICS"');
    const s = report.summary;
    rows.push(`"Metric","Value"`);
    rows.push(`"Total Income",${s.totalIncome.toFixed(2)}`);
    rows.push(`"Total Expense",${s.totalExpense.toFixed(2)}`);
    rows.push(`"Net Balance",${s.netBalance.toFixed(2)}`);
    rows.push(`"Savings Rate",${s.savingsRate.toFixed(1)}%`);
    rows.push(`"Largest Income",${s.largestIncome.toFixed(2)}`);
    rows.push(`"Largest Expense",${s.largestExpense.toFixed(2)}`);
    rows.push(`"Average Daily Spend",${s.averageDailySpend.toFixed(2)}`);
    rows.push(`"Average Monthly Spend",${s.averageMonthlySpend.toFixed(2)}`);
    rows.push(`"Budget Utilization",${s.budgetUtilization.toFixed(1)}%`);
    rows.push(`"Overspending Categories Count",${s.overspendingCategoriesCount}`);
    rows.push(`"Transaction Count",${s.transactionCount}`);
    rows.push('');

    // 3. Category Breakdown Table
    rows.push('"CATEGORY BREAKDOWN"');
    rows.push('"Category Name","Type","Amount","Percentage","Count"');
    for (const c of report.categoryBreakdown) {
      rows.push(`${escape(c.name)},${escape(c.type)},${c.amount.toFixed(2)},${c.percentage.toFixed(1)}%,${c.count}`);
    }
    rows.push('');

    // 4. Detailed Transaction Log Table
    rows.push('"DETAILED TRANSACTION LOG"');
    rows.push('"Date","Title","Category","Type","Amount","Payment Method"');
    for (const t of report.transactions) {
      const dateStr = new Date(t.date).toLocaleDateString();
      rows.push(`${escape(dateStr)},${escape(t.title)},${escape(t.categoryName)},${escape(t.type)},${t.amount.toFixed(2)},${escape(t.paymentMethod)}`);
    }

    return rows.join('\n');
  },
};
