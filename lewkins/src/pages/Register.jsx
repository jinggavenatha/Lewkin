import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { registerUser } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('pembeli'); // Default role, tidak bisa diubah user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        username,
        email,
        password,
        role
      });

      // Registration successful, redirect to login
      alert('Registrasi berhasil! Silakan login dengan akun Anda.');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Daftar</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block font-semibold mb-1">Username</label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="Masukkan username"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="Masukkan email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold mb-1">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="Masukkan password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block font-semibold mb-1">Konfirmasi Password</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="Konfirmasi password"
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
      
      <p className="mt-4 text-center">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
