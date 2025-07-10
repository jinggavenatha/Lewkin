import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { state, dispatch } = useStore();
  const { cartItems } = state.cart;

  const removeFromCart = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
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

  // Generate unique key untuk setiap cart item
  const generateCartItemKey = (item) => {
    return `${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`;
  };

  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>
          Cart is empty. <Link to="/products" className="text-blue-600 underline">Go shopping</Link>
        </p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={generateCartItemKey(item)} className="flex items-center space-x-4 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-grow">
                <Link to={`/products/${item.id}`} className="text-lg font-semibold text-black hover:text-gray-700 transition-colors">
                  {item.name}
                </Link>
                <p className="text-gray-600">Price: Rp {item.price.toLocaleString('id-ID')}</p>
                {item.size && <p className="text-gray-600">Size: {item.size}</p>}
                {item.color && <p className="text-gray-600">Color: {item.color}</p>}
                <p className="text-sm text-gray-500">Subtotal: Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
              </div>
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
          <div className="text-right font-semibold text-lg border-t pt-4">
            Total: Rp {totalPrice.toLocaleString('id-ID')}
          </div>
          <div className="text-right">
            <Link to="/checkout" className="bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition-colors inline-block">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
