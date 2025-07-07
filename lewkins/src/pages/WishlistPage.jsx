import React from 'react';
import Wishlist from '../components/Wishlist';

export default function WishlistPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Your Wishlist</h1>
      <Wishlist />
    </div>
  );
}
