import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Shimmer page loading skeleton for code split routes
const PageLoader: React.FC = () => (
  <div className="w-full h-[60vh] flex flex-col justify-center items-center space-y-4">
    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">Loading Workspace...</div>
  </div>
);

// Lazy loaded page components (named exports mapped to default)
const Login = React.lazy(() => import('../pages/Login').then((m) => ({ default: m.Login })));
const Register = React.lazy(() => import('../pages/Register').then((m) => ({ default: m.Register })));
const Dashboard = React.lazy(() => import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Transactions = React.lazy(() => import('../pages/Transactions').then((m) => ({ default: m.Transactions })));
const Categories = React.lazy(() => import('../pages/Categories').then((m) => ({ default: m.Categories })));
const Budgets = React.lazy(() => import('../pages/Budgets').then((m) => ({ default: m.Budgets })));
const Reports = React.lazy(() => import('../pages/Reports').then((m) => ({ default: m.Reports })));
const DataIntelligence = React.lazy(() => import('../pages/DataIntelligence').then((m) => ({ default: m.DataIntelligence })));
const NotificationCenter = React.lazy(() => import('../pages/NotificationCenter').then((m) => ({ default: m.NotificationCenter })));
const ActivityTimeline = React.lazy(() => import('../pages/ActivityTimeline').then((m) => ({ default: m.ActivityTimeline })));
const Workspace = React.lazy(() => import('../pages/Workspace').then((m) => ({ default: m.Workspace })));

export const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public auth pathways */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected operational pathways */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Index redirection to Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="categories" element={<Categories />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="reports" element={<Reports />} />
            <Route path="intelligence" element={<DataIntelligence />} />
            <Route path="notifications" element={<NotificationCenter />} />
            <Route path="activity" element={<ActivityTimeline />} />
            <Route path="settings" element={<Workspace />} />
          </Route>

          {/* Fallback wildcard redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};
