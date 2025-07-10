import React from 'react';
import { useStore } from '../context/StoreContext';

export default function Account() {
  const { state, auth } = useStore();
  const user = state.auth.user;
  const isAuthenticated = state.auth.isAuthenticated;

  const handleLogout = async () => {
    await auth.logout();
  };

  if (!isAuthenticated || !user) {
    return <p>Please login to view your account.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Account</h1>
      <div className="space-y-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
      <button 
        onClick={handleLogout} 
        className="btn-primary mt-6"
      >
        Logout
      </button>
    </div>
  );
}
