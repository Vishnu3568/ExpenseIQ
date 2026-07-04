import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useBudgets } from '../hooks/useBudgets';
import { useReports } from '../hooks/useReports';
import { ReportFiltersPanel } from '../components/reporting/ReportFiltersPanel';
import { ReportPreview } from '../components/reporting/ReportPreview';
import { ReportHistoryList } from '../components/reporting/ReportHistoryList';
import { useAuth } from '../hooks/useAuth';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { ReportFilter } from '../types/report';

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const { rawCategories } = useCategories();
  const { progressList } = useBudgets();

  const {
    reportsList,
    activePreview,
    isLoading,
    error,
    setError,
    generatePreview,
    saveReport,
    deleteReport,
    exportReport,
    loadSavedReport,
  } = useReports();

  const [isSaving, setIsSaving] = useState(false);

  const handleGeneratePreview = async (payload: {
    name: string;
    type: string;
    template: string;
    filters: ReportFilter;
  }) => {
    try {
      setError(null);
      await generatePreview({
        name: payload.name,
        type: payload.type,
        filters: payload.filters,
        template: payload.template,
      });
    } catch (err) {
      // Error is set in the hook
    }
  };

  const handleSaveToHistory = async () => {
    if (!activePreview) return;
    setIsSaving(true);
    try {
      const savedReport = await saveReport({
        name: activePreview.name,
        type: activePreview.type,
        filters: activePreview.filters,
        template: activePreview.template,
      });
      if (savedReport) {
        // Reload details of saved report to populate ID and enable export actions
        await loadSavedReport(savedReport.id);
      }
    } catch (err) {
      // Handled by hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel' | 'html') => {
    if (!activePreview?.id) return;
    await exportReport(activePreview.id, format);
  };

  const handleHistoryExport = async (id: string, format: 'pdf' | 'csv' | 'excel' | 'html') => {
    await exportReport(id, format);
  };

  const currencySymbol = user?.currency === 'INR' ? '₹' : '$';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Reporting & Export Center
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate high-fidelity financial reports, review summary metrics, and export in PDF, CSV, Excel, or HTML format.
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Main Grid: Form Config (Left) & Preview Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <ReportFiltersPanel
            categories={rawCategories}
            budgets={progressList}
            onSubmit={handleGeneratePreview}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-8 h-full">
          <ReportPreview
            report={activePreview}
            onSave={handleSaveToHistory}
            onExport={handleExport}
            isSaving={isSaving}
            currencySymbol={currencySymbol}
          />
        </div>
      </div>

      {/* History Log listing (Bottom) */}
      <div className="pt-4">
        <ReportHistoryList
          history={reportsList}
          onView={loadSavedReport}
          onDelete={deleteReport}
          onExport={handleHistoryExport}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
export default Reports;
