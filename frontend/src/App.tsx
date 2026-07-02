import { useState, useEffect } from 'react';
import { Activity, Moon, Sun, ShieldCheck } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b bg-card text-card-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">ExpenseIQ</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-6">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-foreground">
          ExpenseIQ Environment Initialized
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-8">
          The development repository setup has completed successfully. Workspaces for React/Vite and Express/TypeScript are fully configured.
        </p>

        {/* Diagnostic Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl bg-card border rounded-2xl p-6 shadow-sm">
          <div className="text-center sm:text-left">
            <div className="text-sm font-semibold text-muted-foreground uppercase">Frontend</div>
            <div className="text-lg font-bold text-foreground mt-1">React + TS + Tailwind</div>
            <div className="text-xs text-success font-medium mt-1">Ready</div>
          </div>
          <div className="text-center sm:text-left border-y sm:border-y-0 sm:border-x py-4 sm:py-0 sm:px-6">
            <div className="text-sm font-semibold text-muted-foreground uppercase">Backend</div>
            <div className="text-lg font-bold text-foreground mt-1">Express + TypeScript</div>
            <div className="text-xs text-success font-medium mt-1">Ready</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-sm font-semibold text-muted-foreground uppercase">Database</div>
            <div className="text-lg font-bold text-foreground mt-1">PostgreSQL + Prisma</div>
            <div className="text-xs text-muted-foreground font-medium mt-1">Configured</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card text-card-foreground py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ExpenseIQ. Architecture & Foundation Verified.
      </footer>
    </div>
  );
}

export default App;
