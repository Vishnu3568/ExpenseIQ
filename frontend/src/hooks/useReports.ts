import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../services/reportService';
import { ReportFilter, ReportDetails, ReportHistoryItem } from '../types/report';

export const useReports = () => {
  const [reportsList, setReportsList] = useState<ReportHistoryItem[]>([]);
  const [activePreview, setActivePreview] = useState<ReportDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await reportService.getHistory();
      if (res.success) {
        setReportsList(res.data);
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to load report history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generatePreview = useCallback(
    async (payload: { name?: string; type: string; filters: ReportFilter; template?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await reportService.generatePreview(payload);
        if (res.success) {
          setActivePreview(res.data);
        }
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errMsg = (err as any).response?.data?.message || 'Failed to generate preview';
        setError(errMsg);
        throw new Error(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const saveReport = useCallback(
    async (payload: { name: string; type: string; filters: ReportFilter; template: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await reportService.saveReport(payload);
        if (res.success) {
          await fetchHistory();
          return res.data;
        }
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errMsg = (err as any).response?.data?.message || 'Failed to save report to history';
        setError(errMsg);
        throw new Error(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchHistory]
  );

  const deleteReport = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await reportService.deleteReport(id);
        if (res.success) {
          setReportsList((prev) => prev.filter((r) => r.id !== id));
          if (activePreview?.id === id) {
            setActivePreview(null);
          }
        }
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError((err as any).response?.data?.message || 'Failed to delete report log');
      } finally {
        setIsLoading(false);
      }
    },
    [activePreview]
  );

  const exportReport = useCallback(async (id: string, format: 'pdf' | 'csv' | 'excel' | 'html') => {
    setIsLoading(true);
    setError(null);
    try {
      await reportService.exportReport(id, format);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || `Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSavedReport = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await reportService.getDetails(id);
      if (res.success) {
        setActivePreview(res.data);
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).response?.data?.message || 'Failed to load saved report details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    reportsList,
    activePreview,
    isLoading,
    error,
    setError,
    fetchHistory,
    generatePreview,
    saveReport,
    deleteReport,
    exportReport,
    loadSavedReport,
    clearPreview: () => setActivePreview(null),
  };
};
