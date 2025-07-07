import React, { useState, useEffect, useMemo } from 'react';

export default function ProductFilter({ products, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Generate dynamic options from available products
  const { availableSizes, availableColors, availableCategories } = useMemo(() => {
    if (!products || products.length === 0) {
      return { availableSizes: [], availableColors: [], availableCategories: [] };
    }

    const sizes = new Set();
    const colors = new Set();
    const categories = new Set();

    products.forEach(product => {
      if (product.sizes) {
        product.sizes.forEach(size => sizes.add(size));
      }
      if (product.colors) {
        product.colors.forEach(color => colors.add(color));
      }
      if (product.category) {
        categories.add(product.category);
      }
    });

    return {
      availableSizes: Array.from(sizes).sort(),
      availableColors: Array.from(colors).sort(),
      availableCategories: Array.from(categories).sort()
    };
  }, [products]);

  useEffect(() => {
    if (!products) return;

    let filtered = products;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by size (case-insensitive)
    if (selectedSize) {
      filtered = filtered.filter((product) =>
        product.sizes && product.sizes.some(size => 
          size.toLowerCase() === selectedSize.toLowerCase()
        )
      );
    }

    // Filter by color (case-insensitive)
    if (selectedColor) {
      filtered = filtered.filter((product) =>
        product.colors && product.colors.some(color => 
          color.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product) =>
        product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    onFilter(filtered);
  }, [searchTerm, selectedSize, selectedColor, selectedCategory, products, onFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSize('');
    setSelectedColor('');
    setSelectedCategory('');
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col space-y-4">
        {/* Search Input */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search products"
          />
          <button
            onClick={handleClearFilters}
            className="mt-2 md:mt-0 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            aria-label="Clear all filters"
          >
            Reset Filter
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by category"
          >
            <option value="">Semua Kategori</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Size Filter */}
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by size"
          >
            <option value="">Semua Ukuran</option>
            {availableSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Color Filter */}
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by color"
          >
            <option value="">Semua Warna</option>
            {availableColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedSize || selectedColor || selectedCategory) && (
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-600">Filter aktif:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Kategori: {selectedCategory}
              </span>
            )}
            {selectedSize && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                Ukuran: {selectedSize}
              </span>
            )}
            {selectedColor && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                Warna: {selectedColor}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
