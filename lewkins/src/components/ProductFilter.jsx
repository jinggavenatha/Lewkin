import React, { useState, useEffect, useMemo } from "react";
import { formatRupiah } from "../utils/formatRupiah";

export default function ProductFilter({ products, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Generate dynamic options
  const { availableSizes, availableColors, availableCategories } =
    useMemo(() => {
      if (!products || products.length === 0) {
        return {
          availableSizes: [],
          availableColors: [],
          availableCategories: [],
        };
      }

      const sizes = new Set();
      const colors = new Set();
      const categories = new Set();

      products.forEach((product) => {
        product.sizes?.forEach((size) => sizes.add(size));
        product.colors?.forEach((color) => colors.add(color));
        if (product.category) categories.add(product.category);
      });

      return {
        availableSizes: Array.from(sizes).sort(),
        availableColors: Array.from(colors).sort(),
        availableCategories: Array.from(categories).sort(),
      };
    }, [products]);

  // Filtering logic
  useEffect(() => {
    if (!products) return;

    let filtered = products;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSize) {
      filtered = filtered.filter((product) =>
        product.sizes?.some(
          (size) => size.toLowerCase() === selectedSize.toLowerCase()
        )
      );
    }

    if (selectedColor) {
      filtered = filtered.filter((product) =>
        product.colors?.some(
          (color) => color.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    onFilter(filtered);
  }, [
    searchTerm,
    selectedSize,
    selectedColor,
    selectedCategory,
    products,
    onFilter,
  ]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSize("");
    setSelectedColor("");
    setSelectedCategory("");
  };


  return (
    <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-sm space-y-5">
      {/* Search + Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleClearFilters}
          className="mt-2 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Reset Filter
        </button>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Kategori</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Ukuran</option>
          {availableSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Warna</option>
          {availableColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedSize || selectedColor || selectedCategory) && (
        <div className="flex flex-wrap gap-2 text-sm pt-2">
          <span className="text-gray-600">Filter aktif:</span>
          {searchTerm && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Cari: "{searchTerm}"
            </span>
          )}
          {selectedCategory && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Kategori: {selectedCategory}
            </span>
          )}
          {selectedSize && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Ukuran: {selectedSize}
            </span>
          )}
          {selectedColor && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Warna: {selectedColor}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
