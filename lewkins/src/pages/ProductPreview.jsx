import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useStore } from '../context/StoreContext';

export default function ProductPreview() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { dispatch } = useStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError('');
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Unable to load product.');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const addToCart = () => {
    if (product) {
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
    }
  };

  const addToWishlist = () => {
    if (product) {
      dispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading product preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96 py-10">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link to="/admin" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-96 py-10">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
          <Link to="/admin" className="btn-primary mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/admin" 
          className="flex items-center text-gray-600 hover:text-black transition-colors duration-200"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Dashboard
        </Link>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Preview Mode
        </div>
      </div>

      {/* Product Preview Card */}
      <div className="bg-white shadow-lg rounded-none overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image || "https://images.pexels.com/photos/460939/pexels-photo-460939.jpeg"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>
              <div className="flex items-center mb-4">
                <span className="text-3xl font-semibold text-black">${product.price.toFixed(2)}</span>
                <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  ID: {product.id}
                </span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button 
                  onClick={addToCart}
                  className="btn-primary flex-grow flex items-center justify-center"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Add to Cart
                </button>
                <button 
                  onClick={addToWishlist}
                  className="btn-secondary px-6"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              
              {/* Additional Admin Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <Link 
                  to={`/products/${product.id}`}
                  className="btn-secondary flex-grow text-center"
                >
                  <i className="fas fa-eye mr-2"></i>
                  View Live Page
                </Link>
                <button className="btn-secondary px-6">
                  <i className="fas fa-edit"></i>
                </button>
              </div>
            </div>

            {/* Product Metadata */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Product Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Product ID:</span>
                  <span className="ml-2 font-medium">{product.id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <span className="ml-2 font-medium">${product.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 font-medium text-green-600">Active</span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 font-medium">Fashion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Notice */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-none p-4">
        <div className="flex items-center">
          <i className="fas fa-info-circle text-yellow-600 mr-3"></i>
          <div>
            <p className="text-yellow-800 font-medium">Preview Mode Active</p>
            <p className="text-yellow-700 text-sm">
              This is how the product will appear to customers. Actions like "Add to Cart" are functional for testing purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
