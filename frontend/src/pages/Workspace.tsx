import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  User,
  Globe,
  Sun,
  Layout,
  Bell,
  Download,
  Shield,
  Database,
  ArrowRight,
} from 'lucide-react';
import ProfileSection from '../components/workspace/ProfileSection';
import PreferencesSection from '../components/workspace/PreferencesSection';
import AppearanceSection from '../components/workspace/AppearanceSection';
import DashboardSection from '../components/workspace/DashboardSection';
import NotificationsSection from '../components/workspace/NotificationsSection';
import ExportSection from '../components/workspace/ExportSection';
import SecuritySection from '../components/workspace/SecuritySection';
import DataManagementSection from '../components/workspace/DataManagementSection';

type TabType =
  | 'PROFILE'
  | 'PREFERENCES'
  | 'APPEARANCE'
  | 'DASHBOARD'
  | 'NOTIFICATIONS'
  | 'EXPORT'
  | 'SECURITY'
  | 'DATA';

export const Workspace: React.FC = () => {
  const { isLoading } = useWorkspace();
  const [activeTab, setActiveTab] = useState<TabType>('PROFILE');

  const tabs = [
    { id: 'PROFILE', label: 'My Profile', icon: User },
    { id: 'PREFERENCES', label: 'Preferences', icon: Globe },
    { id: 'APPEARANCE', label: 'Appearance', icon: Sun },
    { id: 'DASHBOARD', label: 'Dashboard', icon: Layout },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
    { id: 'EXPORT', label: 'Export Preferences', icon: Download },
    { id: 'SECURITY', label: 'Security Center', icon: Shield },
    { id: 'DATA', label: 'Data Management', icon: Database },
  ] as const;

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'PROFILE':
        return <ProfileSection />;
      case 'PREFERENCES':
        return <PreferencesSection />;
      case 'APPEARANCE':
        return <AppearanceSection />;
      case 'DASHBOARD':
        return <DashboardSection />;
      case 'NOTIFICATIONS':
        return <NotificationsSection />;
      case 'EXPORT':
        return <ExportSection />;
      case 'SECURITY':
        return <SecuritySection />;
      case 'DATA':
        return <DataManagementSection />;
      default:
        return <ProfileSection />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded lg:col-span-1"></div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded lg:col-span-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Workspace & Settings</h1>
        <p className="text-xs text-slate-550 dark:text-slate-400">
          Manage your account configurations, theme profiles, notifications, regional formats, and ledger data settings.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side Navigation (Desktop: Vertical, Mobile: Horizontal) */}
        <aside className="lg:col-span-1 overflow-x-auto lg:overflow-x-visible -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none">
          <div className="flex lg:flex-col gap-1.5 min-w-[max-content] lg:min-w-0 pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-650 dark:bg-indigo-950/40 text-white dark:text-indigo-400 border-l-4 border-indigo-500 shadow-sm'
                      : 'border-l-4 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/30 text-slate-550 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  <ArrowRight className={`h-3 w-3 hidden lg:block transition-transform ${isActive ? 'translate-x-0.5 text-white dark:text-indigo-400' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Side Settings Forms Container */}
        <main className="lg:col-span-3 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm backdrop-blur-md">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Workspace;
