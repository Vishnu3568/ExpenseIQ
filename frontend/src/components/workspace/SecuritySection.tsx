import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Shield, Key, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import workspaceService from '../../services/workspaceService';
import { SecurityInfoResponse } from '../../types/workspace';

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const SecuritySection: React.FC = () => {
  const { profile } = useWorkspace();
  const [securityData, setSecurityData] = useState<SecurityInfoResponse | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password requirements validation state variables
  const reqs = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[#?!@$%^&*-]/.test(newPassword),
  };

  const isFormValid =
    oldPassword &&
    newPassword &&
    newPassword === confirmPassword &&
    Object.values(reqs).every(Boolean);

  useEffect(() => {
    const loadSecurity = async () => {
      try {
        const res = await workspaceService.getSecurity();
        if (res.success) {
          setSecurityData(res.data);
        }
      } catch (err) {
        console.error('Failed to load security metrics:', err);
      }
    };
    loadSecurity();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await workspaceService.updatePassword({
        oldPassword,
        newPasswordHash: newPassword,
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Password successfully updated!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as AxiosErrorLike).response?.data?.message || 'Failed to update password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile || !securityData) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header description */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Security & Access Management</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Change your password and review active device sessions logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change password form */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Key className="h-3.5 w-3.5 text-indigo-500" /> Update Password
          </h4>

          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Current Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-3 pr-10 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <span className="text-[10px] text-rose-500 block mt-1">Passwords do not match</span>
            )}
          </div>

          {/* Requirements visual checks */}
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Requirements checklist:</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                {reqs.length ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-500" />}
                <span className={reqs.length ? 'text-slate-600 dark:text-slate-350' : 'text-slate-400'}>Min 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                {reqs.upper ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-500" />}
                <span className={reqs.upper ? 'text-slate-600 dark:text-slate-350' : 'text-slate-400'}>1 Uppercase (A-Z)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {reqs.lower ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-500" />}
                <span className={reqs.lower ? 'text-slate-600 dark:text-slate-350' : 'text-slate-400'}>1 Lowercase (a-z)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {reqs.number ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-500" />}
                <span className={reqs.number ? 'text-slate-600 dark:text-slate-350' : 'text-slate-400'}>1 Number (0-9)</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                {reqs.special ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-500" />}
                <span className={reqs.special ? 'text-slate-600 dark:text-slate-350' : 'text-slate-400'}>1 Special char (#?!@$%^&*-)</span>
              </div>
            </div>
          </div>

          {/* Status message */}
          {statusMsg && (
            <div className={`p-3 rounded-lg text-xs font-medium ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'}`}>
              {statusMsg.text}
            </div>
          )}

          {/* Action trigger */}
          <div className="flex justify-end">
            <Button type="submit" disabled={!isFormValid || isSubmitting} isLoading={isSubmitting} variant="primary">
              Change Password
            </Button>
          </div>
        </form>

        {/* Sessions Tracker card */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Shield className="h-3.5 w-3.5 text-indigo-500" /> Active Session Logs
          </h4>

          {/* Current Session details */}
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Session</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-650 dark:bg-indigo-950/30 dark:text-indigo-400">Current Device</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <div>IP: {securityData.currentSession.ip}</div>
              <div className="text-right">Browser: {securityData.currentSession.device}</div>
            </div>
          </div>

          {/* Recent Sessions list */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Recent Session Audits</span>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/10">
              {securityData.recentSessions.map((session) => (
                <div key={session.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/10 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{session.device}</span>
                    <span className="text-[9px] text-slate-400 flex items-center gap-1">
                      IP: {session.ip} &bull; {new Date(session.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">{session.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SecuritySection;
