import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-10 px-3 rounded-lg border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-ring focus:border-transparent ${
            error ? 'border-danger focus:ring-danger' : 'border-input'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-danger font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
