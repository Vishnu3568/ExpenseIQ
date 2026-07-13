import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console (or forward to structured front-end error logger)
    console.error('Uncaught error inside React Tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
          <div className="max-w-md w-full border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-xl text-center flex flex-col items-center gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-full">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              An unexpected application error occurred. We have logged the error details.
            </p>
            {this.state.error && (
              <pre className="w-full p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg text-left text-xs font-mono overflow-auto max-h-32 text-slate-600 dark:text-slate-400">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
            >
              <RotateCcw className="h-4 w-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
