import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function CheckoutForm() {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    bankAccount: '',
    ewalletPhone: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful payment
      dispatch({ type: 'CART_CLEAR' });
      setOrderSuccess(true);
      
      // Generate order ID
      const orderId = 'LWK' + Date.now().toString().slice(-8);
      console.log('Order placed successfully:', { orderId, ...formData });
      
    } catch (error) {
      alert('Pembayaran gagal. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const total = state.cart.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 15000; // IDR 15,000
  const tax = total * 0.11; // PPN 11%
  const grandTotal = total + shippingCost + tax;

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-green-600 text-6xl mb-6">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="text-3xl font-bold mb-4">Pesanan Berhasil!</h2>
        <p className="text-gray-600 mb-6">
          Terima kasih atas pembelian Anda. Pesanan sedang diproses dan akan segera dikirim.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-600">ID Pesanan</p>
          <p className="text-xl font-bold">LWK{Date.now().toString().slice(-8)}</p>
        </div>
        <button 
          onClick={() => window.location.href = '/shop'}
          className="btn-primary"
        >
          Lanjut Berbelanja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-heading font-bold mb-8">Checkout</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Pengiriman */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Informasi Pengiriman</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Nama Depan</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Nama Belakang</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-medium mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">No. Telepon</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block font-medium mb-2">Alamat Lengkap</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block font-medium mb-2">Kota</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Provinsi</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Pilih Provinsi</option>
                    <option value="jakarta">DKI Jakarta</option>
                    <option value="jabar">Jawa Barat</option>
                    <option value="jateng">Jawa Tengah</option>
                    <option value="jatim">Jawa Timur</option>
                    <option value="bali">Bali</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-2">Kode Pos</label>
                  <input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Metode Pembayaran</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleInputChange}
                      className="text-black"
                    />
                    <span className="flex items-center">
                      <i className="fas fa-credit-card mr-2"></i>
                      Kartu Kredit/Debit
                    </span>
                  </label>
                  {formData.paymentMethod === 'credit-card' && (
                    <div className="mt-4 ml-6 space-y-3">
                      <input
                        name="cardName"
                        placeholder="Nama di Kartu"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        required
                      />
                      <input
                        name="cardNumber"
                        placeholder="Nomor Kartu"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        required
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="input-field w-full"
                          required
                        />
                        <input
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="input-field w-full"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === 'bank-transfer'}
                      onChange={handleInputChange}
                      className="text-black"
                    />
                    <span className="flex items-center">
                      <i className="fas fa-university mr-2"></i>
                      Transfer Bank
                    </span>
                  </label>
                  {formData.paymentMethod === 'bank-transfer' && (
                    <div className="mt-4 ml-6">
                      <select
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        required
                      >
                        <option value="">Pilih Bank</option>
                        <option value="bca">BCA - 1234567890</option>
                        <option value="mandiri">Mandiri - 0987654321</option>
                        <option value="bni">BNI - 1122334455</option>
                        <option value="bri">BRI - 5544332211</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ewallet"
                      checked={formData.paymentMethod === 'ewallet'}
                      onChange={handleInputChange}
                      className="text-black"
                    />
                    <span className="flex items-center">
                      <i className="fas fa-mobile-alt mr-2"></i>
                      E-Wallet (GoPay, OVO, DANA)
                    </span>
                  </label>
                  {formData.paymentMethod === 'ewallet' && (
                    <div className="mt-4 ml-6">
                      <input
                        name="ewalletPhone"
                        placeholder="Nomor HP E-Wallet"
                        value={formData.ewalletPhone}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="text-black"
                    />
                    <span className="flex items-center">
                      <i className="fas fa-money-bill-wave mr-2"></i>
                      Bayar di Tempat (COD)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="btn-primary w-full py-4 text-lg"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Memproses Pembayaran...
                </span>
              ) : (
                `Bayar Sekarang - Rp ${grandTotal.toLocaleString('id-ID')}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3">
              {state.cart.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <hr className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN (11%)</span>
                <span>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
