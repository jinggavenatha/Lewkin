import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { state, dispatch } = useStore();
  const { cartItems } = state.cart;

  const removeFromCart = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const updateQuantity = (item, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
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
            <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
              <div className="flex-grow">
                <Link to={`/products/${item.id}`} className="text-lg font-semibold text-black">
                  {item.name}
                </Link>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                <p className="text-gray-600">Size: {item.size || 'N/A'}</p>
                <p className="text-gray-600">Color: {item.color || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item, item.quantity - 1)}
                  className="btn-secondary px-3 py-1"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item, item.quantity + 1)}
                  className="btn-secondary px-3 py-1"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item)}
                className="text-red-600 hover:text-red-800"
                aria-label={`Remove ${item.name} from cart`}
              >
                &times;
              </button>
            </div>
          ))}
          <div className="text-right font-semibold text-lg">
            Total: ${totalPrice.toFixed(2)}
          </div>
          <div className="text-right">
            <Link to="/checkout" className="btn-primary inline-block">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
