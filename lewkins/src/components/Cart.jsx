import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../utils/formatRupiah';
import { toast } from 'react-toastify';

export default function Cart() {
  const { state, dispatch } = useStore();
  const { cartItems } = state.cart;

  const removeFromCart = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    toast.success('Produk berhasil dihapus dari keranjang');
  };

  const updateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item);
      return;
    }
    
    // Remove item lama dan tambahkan dengan quantity baru
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity: newQuantity } });
  };

  const updateItemOption = (item, field, newValue, itemIndex) => {
    // Create updated item with new field value
    const updatedItem = { ...item, [field]: newValue };
    
    // Update cart items by index instead of removing and re-adding
    const updatedCartItems = cartItems.map((cartItem, index) => 
      index === itemIndex ? updatedItem : cartItem
    );
    
    // Dispatch updated cart items directly
    dispatch({ type: 'CART_UPDATE_ITEMS', payload: updatedCartItems });
    toast.success(`${field === 'size' ? 'Ukuran' : 'Warna'} berhasil diubah`);
  };

  // Generate unique key untuk setiap cart item
  const generateCartItemKey = (item) => {
    return `${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`;
  };

  const totalPrice = cartItems.reduce((a, c) => a + c.price * (c.quantity || 1), 0);

  return (
    <div className="flex justify-center items-center min-h-64">
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">
          Cart is empty. 
          <Link 
            to="/products" 
            className="text-blue-600 underline ml-1">
              Go shopping
          </Link>
        </p>
      ) : (
        <div className="space-y-4 w-full max-w-4xl">
          {cartItems.map((item, index) => (
            <div 
              key={generateCartItemKey(item)} 
              className="flex items-center space-x-4 border-b pb-4 bg-white p-4 rounded-lg shadow-sm"
            >

              <img 
                src={item.image} 
                alt={item.name} 
                className="w-20 h-20 object-cover rounded" 
              />

              <div className="flex-grow">
                <Link 
                  to={`/products/${item.id}`} 
                  className="text-lg font-semibold text-black hover:text-gray-700 transition-colors block mb-2">
                  {item.name}
                </Link>

                <p className="text-gray-600 mb-2"> 
                  Price: {formatRupiah(item.price)}
                </p>

                {/* Size and Color Options */}
                <div className="flex flex-wrap gap-4 mb-2">
                  {/* Size Dropdown */}
                  {item.sizes && item.sizes.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Size:</label>
                      <select
                        value={item.size || ''}
                        onChange={(e) => updateItemOption(item, 'size', e.target.value, index)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {item.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Color Dropdown */}
                  {item.colors && item.colors.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Color:</label>
                      <select
                        value={item.color || ''}
                        onChange={(e) => updateItemOption(item, 'color', e.target.value, index)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {item.colors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Current Selection Display */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.size && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Size: {item.size}
                    </span>
                  )}
                  {item.color && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Color: {item.color}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 font-medium">
                  Subtotal: {formatRupiah(item.price * (item.quantity || 1))}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item, item.quantity - 1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item, item.quantity + 1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item)}
                className="text-red-600 hover:text-red-800 p-1 transition-colors"
                aria-label={`Remove ${item.name} from cart`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Total and Checkout */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-right font-semibold text-xl border-t pt-4 mb-4">
              Total: {formatRupiah(totalPrice)}
            </div>
            <div className="text-right">
              <Link 
                to="/checkout" 
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
