import apiClient from './apiClient';
import { ReportFilter, ReportDetails, ReportHistoryItem } from '../types/report';

export const reportService = {
  /**
   * Generates report data live for a preview
   */
  async generatePreview(payload: {
    name?: string;
    type: string;
    filters: ReportFilter;
    template?: string;
  }): Promise<{ success: boolean; data: ReportDetails }> {
    const response = await apiClient.post<{ success: boolean; data: ReportDetails }>(
      '/api/reports/preview',
      payload
    );
    return response.data;
  },

  /**
   * Saves a report configuration to history log
   */
  async saveReport(payload: {
    name: string;
    type: string;
    filters: ReportFilter;
    template: string;
  }): Promise<{ success: boolean; data: ReportHistoryItem }> {
    const response = await apiClient.post<{ success: boolean; data: ReportHistoryItem }>(
      '/api/reports',
      payload
    );
    return response.data;
  },

  /**
   * Retrieves all saved report history logs for current user
   */
  async getHistory(): Promise<{ success: boolean; data: ReportHistoryItem[] }> {
    const response = await apiClient.get<{ success: boolean; data: ReportHistoryItem[] }>(
      '/api/reports'
    );
    return response.data;
  },

  /**
   * Fetches single report metadata + live calculations
   */
  async getDetails(id: string): Promise<{ success: boolean; data: ReportDetails }> {
    const response = await apiClient.get<{ success: boolean; data: ReportDetails }>(
      `/api/reports/${id}`
    );
    return response.data;
  },

  /**
   * Deletes a report configuration from history
   */
  async deleteReport(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/api/reports/${id}`
    );
    return response.data;
  },

  /**
   * Downloads a report file from the backend in the requested format
   */
  async exportReport(id: string, format: 'pdf' | 'csv' | 'excel' | 'html'): Promise<void> {
    const response = await apiClient.get(`/api/reports/${id}/export/${format}`, {
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `report_${id}.${format === 'excel' ? 'xlsx' : format}`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
export default reportService;
