import React, { useState, useEffect } from 'react';

export default function ProductFilter({ products, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSize) {
      filtered = filtered.filter((product) =>
        product.sizes.includes(selectedSize)
      );
    }

    if (selectedColor) {
      filtered = filtered.filter((product) =>
        product.colors.includes(selectedColor)
      );
    }

    onFilter(filtered);
  }, [searchTerm, selectedSize, selectedColor, products, onFilter]);

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-field mb-2 md:mb-0 md:flex-grow"
        aria-label="Search products"
      />
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
        className="input-field mb-2 md:mb-0"
        aria-label="Filter by size"
      >
        <option value="">All Sizes</option>
        <option value="S">Small (S)</option>
        <option value="M">Medium (M)</option>
        <option value="L">Large (L)</option>
        <option value="XL">Extra Large (XL)</option>
      </select>
      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="input-field"
        aria-label="Filter by color"
      >
        <option value="">All Colors</option>
        <option value="black">Black</option>
        <option value="white">White</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>
    </div>
  );
}
