import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { state, dispatch } = useStore();
  const { items } = state.wishlist;

  const removeFromWishlist = (item) => {
    dispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
      {items.length === 0 ? (
        <p>
          Your wishlist is empty. <Link to="/products" className="text-blue-600 underline">Browse products</Link>
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
              <div className="flex-grow">
                <Link to={`/products/${item.id}`} className="text-lg font-semibold text-black">
                  {item.name}
                </Link>
                <p className="text-gray-600">Price: ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromWishlist(item)}
                className="text-red-600 hover:text-red-800"
                aria-label={`Remove ${item.name} from wishlist`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
