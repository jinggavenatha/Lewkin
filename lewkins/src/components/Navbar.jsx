import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, auth } = useStore();
  const cartCount = state.cart.cartItems.length;
  const wishlistCount = state.wishlist.items.length;
  const isAuthenticated = state.auth.isAuthenticated;
  const user = state.auth.user;
  const isAdmin = user?.role === 'admin';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await auth.logout();
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-black">
          Lewkin
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
            Home
          </NavLink>
          
          {/* Authenticated Area */}
          {isAuthenticated ? (
            <>
              <NavLink to="/shop" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                Shop
              </NavLink>
              <NavLink to="/products" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                Products
              </NavLink>
              <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                Wishlist {wishlistCount > 0 && <span className="ml-1 text-sm text-red-600">({wishlistCount})</span>}
              </NavLink>
              <NavLink to="/cart" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                Cart {cartCount > 0 && <span className="ml-1 text-sm text-green-600">({cartCount})</span>}
              </NavLink>
              <NavLink to="/account" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                Account
              </NavLink>
              
              {/* Admin-only navigation */}
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                  Admin
                </NavLink>
              )}
              
              <div className="relative group">
                <button className="text-gray-600 hover:text-black flex items-center">
                  {user?.name || user?.email} ▼
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
                  <NavLink to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </NavLink>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Public Area */
            <>
              <NavLink to="/products" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                Products
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
                Register
              </NavLink>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu" className="text-black focus:outline-none focus:ring-2 focus:ring-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <NavLink to="/" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Home
          </NavLink>
          
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 border-b">
                Welcome, {user?.name || user?.email}
                {isAdmin && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>}
              </div>
              <NavLink to="/shop" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Shop
              </NavLink>
              <NavLink to="/products" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Products
              </NavLink>
              <NavLink to="/wishlist" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Wishlist {wishlistCount > 0 && <span className="ml-1 text-sm text-red-600">({wishlistCount})</span>}
              </NavLink>
              <NavLink to="/cart" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Cart {cartCount > 0 && <span className="ml-1 text-sm text-green-600">({cartCount})</span>}
              </NavLink>
              <NavLink to="/account" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Account
              </NavLink>
              
              {isAdmin && (
                <NavLink to="/admin" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Admin Dashboard
                </NavLink>
              )}
              
              <button 
                onClick={() => { handleLogout(); toggleMenu(); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/products" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Products
              </NavLink>
              <NavLink to="/login" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Login
              </NavLink>
              <NavLink to="/register" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
