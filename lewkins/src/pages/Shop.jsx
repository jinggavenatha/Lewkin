import React from 'react';
import ProductList from './Products';

export default function Shop() {
  return (
    <div>
      <section className="mb-8">
        <h1 className="text-4xl font-heading font-bold mb-4">lewkins Shop</h1>
        <p className="text-lg text-gray-700">
          Selamat datang di area belanja eksklusif. Temukan koleksi fashion terbaru kami.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Produk Unggulan</h2>
        <ProductList />
      </section>
    </div>
  );
}
