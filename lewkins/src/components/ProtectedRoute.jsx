import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { state } = useStore();
  const { isAuthenticated, user, loading } = state.auth;

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin required but user is not admin
  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
}
