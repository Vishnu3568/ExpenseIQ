import React from 'react';
import { Spinner } from './Spinner';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Spinner size="lg" className="mb-4" />
      <p className="text-muted-foreground font-medium animate-pulse">Restoring your session...</p>
    </div>
  );
};
