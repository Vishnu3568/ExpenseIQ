import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { LayoutGrid, CreditCard, FolderTree, Landmark, BarChart3, Settings } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case 'dashboard':
        return <LayoutGrid className="h-10 w-10" />;
      case 'transactions':
        return <CreditCard className="h-10 w-10" />;
      case 'categories':
        return <FolderTree className="h-10 w-10" />;
      case 'budgets':
        return <Landmark className="h-10 w-10" />;
      case 'reports':
        return <BarChart3 className="h-10 w-10" />;
      case 'settings':
        return <Settings className="h-10 w-10" />;
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor your financial allocations.</p>
      </div>
      <EmptyState
        title={`${title} Module`}
        description={`The ${title.toLowerCase()} workspace will be fully implemented in a subsequent project development phase.`}
        icon={getIcon()}
      />
    </div>
  );
};
