import React from 'react';
import { useStore } from '../context/StoreContext';

export default function Account() {
  const { state, dispatch } = useStore();
  const userInfo = state.userInfo;

  const handleLogout = () => {
    dispatch({ type: 'USER_LOGOUT' });
  };

  if (!userInfo) {
    return <p>Please login to view your account.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Account</h1>
      <p className="mb-4">Email: {userInfo.email}</p>
      <button onClick={handleLogout} className="btn-primary">
        Logout
      </button>
    </div>
  );
}
