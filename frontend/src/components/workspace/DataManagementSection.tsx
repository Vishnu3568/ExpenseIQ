import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import workspaceService from '../../services/workspaceService';
import { Download, RefreshCw, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const DataManagementSection: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState<'NONE' | 'DELETE_TX' | 'RESET_DEMO' | 'DELETE_ACCOUNT'>('NONE');
  const [confirmInput, setConfirmInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportData = async () => {
    try {
      const blob = await workspaceService.exportPersonalData();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenseiq_backup_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
    }
  };

  const handlePurgeTransactions = async () => {
    if (confirmInput !== 'DELETE ALL TRANSACTIONS') return;
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await workspaceService.purgeTransactions();
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'All transaction history was purged successfully!' });
        setModalOpen('NONE');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to purge transactions' });
    } finally {
      setIsSubmitting(false);
      setConfirmInput('');
    }
  };

  const handleResetDemo = async () => {
    if (confirmInput !== 'RESET DEMO DATA') return;
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await workspaceService.resetDemoData();
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Demo database entries successfully loaded!' });
        setModalOpen('NONE');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to reset demo data' });
    } finally {
      setIsSubmitting(false);
      setConfirmInput('');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmInput !== 'DELETE PERMANENTLY') return;
    setIsSubmitting(true);
    try {
      const res = await workspaceService.deleteAccount();
      if (res.success) {
        setModalOpen('NONE');
        if (authContext) {
          await authContext.logout();
        }
        navigate('/login');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to delete account' });
      setIsSubmitting(false);
      setConfirmInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header description */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Data & Workspace Management</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Export personal backups or trigger destructive reset options.</p>
      </div>

      {/* Backup and export cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Card */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-650 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
              <Download className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Export Backup Profile</span>
              <span className="text-[10px] text-slate-400">Download a full JSON file containing your categories, budgets, and transactions ledger.</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Export JSON File
            </button>
          </div>
        </div>

        {/* Demo Reset Card */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-650 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Reset Demo Ledger</span>
              <span className="text-[10px] text-slate-400">Purge all entries and seed predefined transactions to preview layouts.</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setModalOpen('RESET_DEMO')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Reset to Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Destructive options list */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Destructive Operations Zone</h4>

        <div className="divide-y divide-rose-50/20 dark:divide-rose-950/10 border border-rose-100/50 dark:border-rose-950/25 rounded-2xl overflow-hidden bg-rose-50/5 dark:bg-rose-950/5">
          {/* Delete all transactions */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Delete Transaction ledger</span>
                <span className="text-[10px] text-slate-400">Wipes all logged income/expense entries permanently. This cannot be undone.</span>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={() => setModalOpen('DELETE_TX')}>
              Purge Transactions
            </Button>
          </div>

          {/* Delete Account */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertOctagon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Delete Permanent Account</span>
                <span className="text-[10px] text-slate-400">Deletes your credentials, profile workspace, settings, and ledger files permanently.</span>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={() => setModalOpen('DELETE_ACCOUNT')}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {statusMsg && (
        <div className={`p-3 rounded-lg text-xs font-medium ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'}`}>
          {statusMsg.text}
        </div>
      )}

      {/* Modal - Delete Transactions */}
      <Modal isOpen={modalOpen === 'DELETE_TX'} onClose={() => setModalOpen('NONE')} title="Purge Transactions Ledger">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This action will permanently delete **all transaction records** associated with your account.
          </p>
          <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/30 rounded-xl text-xs text-rose-600 dark:text-rose-400">
            Please type **DELETE ALL TRANSACTIONS** in the field below to confirm this request.
          </div>
          <input
            type="text"
            required
            placeholder="Type verification phrase..."
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-rose-500"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen('NONE')}>Cancel</Button>
            <Button
              variant="danger"
              disabled={confirmInput !== 'DELETE ALL TRANSACTIONS' || isSubmitting}
              isLoading={isSubmitting}
              onClick={handlePurgeTransactions}
            >
              Confirm Purge
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal - Reset Demo Data */}
      <Modal isOpen={modalOpen === 'RESET_DEMO'} onClose={() => setModalOpen('NONE')} title="Reset Demo Workspace">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This will purge your current ledger entries and load a default dataset of categories and sample transactions.
          </p>
          <div className="p-3 bg-amber-50/50 dark:bg-amber-955/10 border border-amber-100 dark:border-amber-900/30 rounded-xl text-xs text-amber-600 dark:text-amber-400">
            Please type **RESET DEMO DATA** in the field below to confirm this request.
          </div>
          <input
            type="text"
            required
            placeholder="Type verification phrase..."
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen('NONE')}>Cancel</Button>
            <Button
              variant="primary"
              disabled={confirmInput !== 'RESET DEMO DATA' || isSubmitting}
              isLoading={isSubmitting}
              onClick={handleResetDemo}
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal - Delete Account */}
      <Modal isOpen={modalOpen === 'DELETE_ACCOUNT'} onClose={() => setModalOpen('NONE')} title="Delete Account permanently">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This action is **irreversible**. Your profile settings, categories, budgets, and all transactions will be permanently deleted.
          </p>
          <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/30 rounded-xl text-xs text-rose-600 dark:text-rose-400">
            Please type **DELETE PERMANENTLY** in the field below to confirm account deletion.
          </div>
          <input
            type="text"
            required
            placeholder="Type verification phrase..."
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-rose-600"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen('NONE')}>Cancel</Button>
            <Button
              variant="danger"
              disabled={confirmInput !== 'DELETE PERMANENTLY' || isSubmitting}
              isLoading={isSubmitting}
              onClick={handleDeleteAccount}
            >
              Permanently Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default DataManagementSection;
