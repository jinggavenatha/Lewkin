import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { state } = useStore();
  const { userInfo } = state;

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && userInfo.role !== "admin") {
    return <Navigate to="/" />; // Atau tampilkan "Access Denied"
  }

  return children;
}
