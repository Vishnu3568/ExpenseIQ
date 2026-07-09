import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FileText, Database, Sparkles, Receipt } from 'lucide-react';
import { Button } from '../ui/Button';

export const ExportSection: React.FC = () => {
  const { exportPrefs, updateExport } = useWorkspace();
  const [pdfTemplate, setPdfTemplate] = useState(exportPrefs?.preferredPdfTemplate || 'clean-modern');
  const [csvDelimiter, setCsvDelimiter] = useState(exportPrefs?.preferredCsvDelimiter || ',');
  const [excelFormatting, setExcelFormatting] = useState(exportPrefs?.excelFormatting ?? true);
  const [reportTemplate, setReportTemplate] = useState(exportPrefs?.defaultReportTemplate || 'standard-summary');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await updateExport({
        preferredPdfTemplate: pdfTemplate,
        preferredCsvDelimiter: csvDelimiter,
        excelFormatting,
        defaultReportTemplate: reportTemplate,
      });
      setStatusMsg({ type: 'success', text: 'Export preferences saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to update preferences' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exportPrefs) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header description */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Export Formatting Presets</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure layout styles and parsing separators for CSV, PDF, and Excel reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Preferred PDF template */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> PDF Template Layout
          </label>
          <select
            value={pdfTemplate}
            onChange={(e) => setPdfTemplate(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="clean-modern">Clean Modern (Indigo highlights)</option>
            <option value="classic">Classic Monochrome (Greyscale minimalist)</option>
            <option value="executive-summary">Executive Summary (Corporate slate styling)</option>
          </select>
        </div>

        {/* Preferred CSV delimiter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" /> CSV Delimiter Separator
          </label>
          <select
            value={csvDelimiter}
            onChange={(e) => setCsvDelimiter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value=",">Comma ( , ) - Standard</option>
            <option value=";">Semicolon ( ; ) - European Regional</option>
            <option value="\t">Tab ( \t ) - TSV Format</option>
          </select>
        </div>

        {/* Default Report Template */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" /> Default Report Presets
          </label>
          <select
            value={reportTemplate}
            onChange={(e) => setReportTemplate(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="standard-summary">Standard Summary (Overview graphs + metrics)</option>
            <option value="detailed-breakdown">Detailed Ledger (Every ledger transaction itemized)</option>
            <option value="minimalist-ledger">Minimalist Totals (Only category breakdowns)</option>
          </select>
        </div>

        {/* Excel formatting check */}
        <div className="md:col-span-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={excelFormatting}
              onChange={(e) => setExcelFormatting(e.target.checked)}
              className="rounded border-slate-200 dark:border-slate-855 text-indigo-650 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Excel Sheet Formatting
              </span>
              <span className="text-[10px] text-slate-400">
                Apply grid border styles, auto-adjust column cell widths, and format numeric currencies automatically inside exported Excel files.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Status Alerts */}
      {statusMsg && (
        <div className={`p-3 rounded-lg text-xs font-medium ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'}`}>
          {statusMsg.text}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} variant="primary">
          Save Preferences
        </Button>
      </div>
    </form>
  );
};
export default ExportSection;
