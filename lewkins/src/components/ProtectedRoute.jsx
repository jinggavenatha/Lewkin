import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProtectedRoute({ children }) {
  const { state } = useStore();
  const userInfo = state.userInfo;

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
