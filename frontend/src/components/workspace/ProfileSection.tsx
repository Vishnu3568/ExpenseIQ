import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { User, Mail, Phone, FileText, Calendar, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProfileSection: React.FC = () => {
  const { profile, updateProfile } = useWorkspace();
  const [name, setName] = useState(profile?.fullName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phoneNumber || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatar, setAvatar] = useState(profile?.avatarUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await updateProfile({
        name,
        email,
        phoneNumber: phone,
        bio,
        avatarUrl: avatar,
      });
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header Description */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Profile Information</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Update your primary identity settings and personal description.</p>
        </div>

        {/* Profile Avatar Card */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="h-14 w-14 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 font-bold text-lg">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Avatar Settings</span>
            <input
              type="text"
              placeholder="Paste image URL (Avatar foundation)..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-755 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Phone Number (Optional)
            </label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Bio (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-755 dark:text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
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
            Save Profile
          </Button>
        </div>
      </form>

      {/* Account Metadata Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Workspace Activity Metadata</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400">Created At</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400">Last Login</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{new Date(profile.lastLoginAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400">Password Changed</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{new Date(profile.passwordChangedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSection;
