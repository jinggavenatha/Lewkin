import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useStore();
  const cartCount = state.cart.cartItems.length;
  const wishlistCount = state.wishlist.items.length;
  const userInfo = state.userInfo;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch({ type: 'USER_LOGOUT' });
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-black">
          Lewkin
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}>
            Home
          </NavLink>
          
          {/* Authenticated Area */}
          {userInfo ? (
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
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-black"
              >
                Logout
              </button>
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
          
          {userInfo ? (
            <>
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
              <button 
                onClick={() => { handleLogout(); toggleMenu(); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Masuk
              </NavLink>
              <NavLink to="/register" onClick={toggleMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Daftar
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
