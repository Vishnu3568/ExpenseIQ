import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-start space-x-3 p-4 bg-danger/10 text-danger border border-danger/20 rounded-lg text-sm text-left">
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};
