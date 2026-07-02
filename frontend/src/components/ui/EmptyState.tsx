import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'There is currently no information to show in this view.',
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border rounded-2xl shadow-sm">
      <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
        {icon || <Database className="h-10 w-10" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
};
