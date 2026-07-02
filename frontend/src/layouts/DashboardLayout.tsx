import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  LayoutGrid,
  CreditCard,
  FolderTree,
  Landmark,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Local theme toggle state
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

  // Close menus on page navigation
  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutGrid className="h-5 w-5" /> },
    { name: 'Transactions', path: '/transactions', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Categories', path: '/categories', icon: <FolderTree className="h-5 w-5" /> },
    { name: 'Budgets', path: '/budgets', icon: <Landmark className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  // Derive page header name
  const currentNav = navItems.find((item) => item.path === location.pathname);
  const pageTitle = currentNav ? currentNav.name : 'ExpenseIQ';

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      {/* 1. Backdrop Overlay for Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. Left Sidebar Navigation Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r bg-card flex flex-col justify-between transform transition-transform duration-250 lg:translate-x-0 lg:static ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Panel */}
          <div className="h-16 border-b flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-xl font-bold tracking-tight text-foreground">ExpenseIQ</span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Links Section */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Sidebar Profile Panel */}
        <div className="p-4 border-t bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 bg-primary/10 rounded-full text-primary flex-shrink-0">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-sm font-semibold truncate">{user?.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 3. Main content frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold tracking-tight text-foreground">{pageTitle}</h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-85 transition-opacity"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 p-1.5 rounded-lg hover:bg-secondary text-sm font-medium transition-colors"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <span>{user?.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 border rounded-lg bg-card text-card-foreground shadow-md py-1 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet Box */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
