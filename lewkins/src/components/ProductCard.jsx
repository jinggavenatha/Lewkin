import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { state, dispatch } = useStore();

  const addToCart = () => {
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
  };

  const addToWishlist = () => {
    dispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
  };

  return (
    <div className="card p-4 rounded-none flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
        <h3 className="text-lg font-semibold text-black">{product.name}</h3>
        <p className="text-gray-700 mt-1">${product.price.toFixed(2)}</p>
      </Link>
      <div className="mt-auto flex space-x-2">
        <button
          onClick={addToCart}
          className="btn-primary flex-grow"
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
        <button
          onClick={addToWishlist}
          className="btn-secondary"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <i className="fas fa-heart"></i>
        </button>
      </div>
    </div>
  );
}
