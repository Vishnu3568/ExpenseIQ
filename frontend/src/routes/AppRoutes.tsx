import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Categories } from '../pages/Categories';
import { Transactions } from '../pages/Transactions';
import { Dashboard } from '../pages/Dashboard';
import { Budgets } from '../pages/Budgets';
import { Reports } from '../pages/Reports';
import { DataIntelligence } from '../pages/DataIntelligence';
import { Workspace } from '../pages/Workspace';
import { NotificationCenter } from '../pages/NotificationCenter';
import { ActivityTimeline } from '../pages/ActivityTimeline';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};
