import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { logoutUser } from '../services/api';

export default function Account() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const userInfo = state.userInfo;

  const handleLogout = () => {
    // Clear API tokens
    logoutUser();
    
    // Clear local state
    dispatch({ type: 'USER_LOGOUT' });
    
    // Redirect to home
    navigate('/');
  };

  if (!userInfo) {
    return <p>Silakan login untuk melihat akun Anda.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Akun Saya</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="space-y-2">
          {userInfo.username && (
            <p><span className="font-semibold">Username:</span> {userInfo.username}</p>
          )}
          {userInfo.name && (
            <p><span className="font-semibold">Nama:</span> {userInfo.name}</p>
          )}
          <p><span className="font-semibold">Email:</span> {userInfo.email}</p>
          {userInfo.role && (
            <p><span className="font-semibold">Role:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                userInfo.role === 'admin' || userInfo.role === 'penjual' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {userInfo.role}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {(userInfo.role === 'admin' || userInfo.role === 'penjual') && (
          <button 
            onClick={() => navigate('/admin')}
            className="btn-secondary w-full"
          >
            Dashboard Admin
          </button>
        )}
        
        <button onClick={handleLogout} className="btn-primary w-full">
          Logout
        </button>
      </div>
    </div>
  );
}
