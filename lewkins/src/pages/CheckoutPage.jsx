import React from 'react';
import CheckoutForm from '../components/CheckoutForm';

export default function CheckoutPage() {
  const handleCheckout = (customerInfo) => {
    // TODO: Integrate Midtrans payment gateway here with customerInfo and cart details
    alert('Checkout process initiated. Integration with Midtrans to be implemented.');
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
      <CheckoutForm onSubmit={handleCheckout} />
    </div>
  );
}
