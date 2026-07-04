import { ReportDetails } from '../types/report';
import { CSVExporter } from './CSVExporter';
import { ExcelExporter } from './ExcelExporter';
import { PDFGenerator } from './PDFGenerator';

export const ExportService = {
  /**
   * Generates export file content, mime-type, and suggested filename for a report
   */
  async exportReport(
    report: ReportDetails,
    format: 'pdf' | 'csv' | 'excel' | 'html'
  ): Promise<{ content: Buffer | string; mimeType: string; filename: string }> {
    const slug = report.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const timestamp = new Date(report.generatedAt).getTime();

    switch (format) {
      case 'pdf': {
        const content = await PDFGenerator.generatePDF(report);
        return {
          content,
          mimeType: 'application/pdf',
          filename: `${slug}_${timestamp}.pdf`,
        };
      }

      case 'csv': {
        const content = CSVExporter.exportToCSV(report);
        return {
          content,
          mimeType: 'text/csv',
          filename: `${slug}_${timestamp}.csv`,
        };
      }

      case 'excel': {
        const content = await ExcelExporter.exportToExcel(report);
        return {
          content,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          filename: `${slug}_${timestamp}.xlsx`,
        };
      }

      case 'html': {
        const content = this.generatePrintableHTML(report);
        return {
          content,
          mimeType: 'text/html',
          filename: `${slug}_${timestamp}.html`,
        };
      }

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  },

  /**
   * Helper to format report details as printable HTML
   */
  generatePrintableHTML(report: ReportDetails): string {
    const s = report.summary;
    const theme = report.template || 'professional';
    
    let primaryColor = '#4F46E5'; // Indigo
    let highlightColor = '#F3F4F6';
    
    if (theme === 'minimal') {
      primaryColor = '#1E293B';
      highlightColor = '#F8FAFC';
    } else if (theme === 'executive') {
      primaryColor = '#0F172A';
      highlightColor = '#FFFBEB';
    }

    const categoriesRows = report.categoryBreakdown
      .map(
        (c) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${c.color || '#CBD5E1'}"></span>
            ${c.name}
          </div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${c.type}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: 600;">$${c.amount.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: right;">${c.percentage.toFixed(1)}%</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: right;">${c.count}</td>
      </tr>`
      )
      .join('');

    const transactionsRows = report.transactions
      .map(
        (t) => `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #F1F5F9;">${new Date(t.date).toLocaleDateString()}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #F1F5F9;">${t.title}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #F1F5F9;">${t.categoryName}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #F1F5F9;">${t.type}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #F1F5F9; text-align: right; color: ${t.type === 'INCOME' ? '#10B981' : '#334155'}; font-weight: 600;">$${t.amount.toFixed(2)}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #F1F5F9;">${t.paymentMethod}</td>
      </tr>`
      )
      .join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.name}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #334155;
      margin: 0;
      padding: 40px;
      background-color: #FFFFFF;
    }
    .header {
      background-color: ${primaryColor};
      color: #FFFFFF;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    .card {
      background-color: ${highlightColor};
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 20px;
      border-top: 4px solid ${primaryColor};
    }
    .card.balance {
      border-top-color: ${s.netBalance >= 0 ? '#10B981' : '#EF4444'};
    }
    .section-title {
      color: ${primaryColor};
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 8px;
      margin-top: 40px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background-color: #F1F5F9;
      text-align: left;
      padding: 10px;
      font-weight: 650;
      font-size: 14px;
    }
    @media print {
      body { padding: 0; }
      .header { border-radius: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background-color: ${primaryColor}; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;">Print Report</button>
  </div>

  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">${report.name}</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">ExpenseIQ Financial Report • Generated on ${new Date(report.generatedAt).toLocaleString()}</p>
  </div>

  <div style="margin-bottom: 30px;">
    <strong>Report Owner:</strong> ${report.userName}<br>
    <strong>Report Type:</strong> ${report.type}
  </div>

  <h2 class="section-title">Executive Metrics</h2>
  <div class="grid">
    <div class="card">
      <div style="color: #64748B; font-size: 12px; font-weight: 600;">TOTAL INCOME</div>
      <div style="font-size: 20px; font-weight: 700; margin-top: 5px; color: ${primaryColor};">$${s.totalIncome.toFixed(2)}</div>
    </div>
    <div class="card">
      <div style="color: #64748B; font-size: 12px; font-weight: 600;">TOTAL EXPENSE</div>
      <div style="font-size: 20px; font-weight: 700; margin-top: 5px; color: ${primaryColor};">$${s.totalExpense.toFixed(2)}</div>
    </div>
    <div class="card balance" style="background-color: ${s.netBalance >= 0 ? '#ECFDF5' : '#FEF2F2'}">
      <div style="color: #64748B; font-size: 12px; font-weight: 600;">NET BALANCE</div>
      <div style="font-size: 20px; font-weight: 700; margin-top: 5px; color: ${s.netBalance >= 0 ? '#10B981' : '#EF4444'};">$${s.netBalance.toFixed(2)}</div>
    </div>
    <div class="card">
      <div style="color: #64748B; font-size: 12px; font-weight: 600;">SAVINGS RATE</div>
      <div style="font-size: 20px; font-weight: 700; margin-top: 5px; color: ${primaryColor};">${s.savingsRate.toFixed(1)}%</div>
    </div>
    <div class="card">
      <div style="color: #64748B; font-size: 12px; font-weight: 600;">DAILY AVG SPEND</div>
      <div style="font-size: 20px; font-weight: 700; margin-top: 5px; color: ${primaryColor};">$${s.averageDailySpend.toFixed(2)}</div>
    </div>
    <div class="card">
      <div style="color: #64748B; font-size: 12px; font-weight: 600;">BUDGET UTILIZATION</div>
      <div style="font-size: 20px; font-weight: 700; margin-top: 5px; color: ${primaryColor};">${s.budgetUtilization.toFixed(1)}%</div>
    </div>
  </div>

  <h2 class="section-title">Category Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Category Name</th>
        <th>Type</th>
        <th style="text-align: right;">Total Amount</th>
        <th style="text-align: right;">Share %</th>
        <th style="text-align: right;">Count</th>
      </tr>
    </thead>
    <tbody>
      ${categoriesRows}
    </tbody>
  </table>

  <h2 class="section-title">Detailed Transactions Log</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Category</th>
        <th>Type</th>
        <th style="text-align: right;">Amount</th>
        <th>Payment Method</th>
      </tr>
    </thead>
    <tbody>
      ${transactionsRows}
    </tbody>
  </table>

  <div style="margin-top: 60px; border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center; color: #94A3B8; font-size: 12px;">
    ExpenseIQ Report Engine v1.0.0 • Page 1 of 1
  </div>
</body>
</html>`;
  },
};
