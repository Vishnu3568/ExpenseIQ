import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-card text-card-foreground border rounded-2xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
        <header className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
