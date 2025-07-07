import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import GlareHover from '../../reactbits/GlareHover/GlareHover';
import ShinyText from '../../reactbits/ShinyText/ShinyText';
import FadeContent from '../../reactbits/FadeContent/FadeContent';

export default function ProductCard({ product, delay = 0 }) {
  const { dispatch } = useStore();

  const addToWishlist = () => {
    dispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
  };

  return (
    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0} delay={delay}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <Link to={`/products/${product.id}`} className="block">
          <div style={{ position: 'relative' }}>
            <GlareHover
              glareColor="#ffffff"
              glareOpacity={0.3}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              playOnce={false}
              width="100%"
              height="100%"
              background="transparent"
              borderRadius="0"
              borderColor="transparent"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </GlareHover>
          </div>
        </Link>
        
        <div className="p-6">
          <Link to={`/products/${product.id}`} className="block mb-4 group">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-700 transition-colors duration-200">{product.name}</h3>
            <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors duration-200">{product.description}</p>
          </Link>
          
          <Link to={`/products/${product.id}`} className="block mb-4">
            <div className="flex justify-between items-center hover:bg-gray-50 p-2 -m-2 rounded transition-colors duration-200">
              <span className="text-2xl font-bold">${product.price}</span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
          </Link>
          
          <div className="mb-4">
            <Link 
              to={`/products/${product.id}`} 
              className="bg-black text-white px-6 py-3 text-sm font-bold hover:bg-gray-800 transition-colors duration-200 text-center rounded w-full flex items-center justify-center"
            >
              <ShinyText text="View Details" disabled={false} speed={3} className="font-bold text-white" />
            </Link>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {product.colors && product.colors.map((color, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {color}
                </span>
              ))}
            </div>
            <button
              onClick={addToWishlist}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
              aria-label="Add to Wishlist"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </FadeContent>
  );
}
