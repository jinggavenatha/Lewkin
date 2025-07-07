import React from 'react';

export default function SearchBar({ searchTerm, onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="input-field w-full mb-4"
      aria-label="Search products"
    />
  );
}
