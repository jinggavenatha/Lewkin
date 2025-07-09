import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import { getProducts } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError("Gagal memuat produk. Silakan coba lagi.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => fetchProducts();

  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);

    const sorted = [...filteredProducts];
    if (sortValue === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sorted);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, selectedCategory, priceRange);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category, priceRange);
  };

  const handlePriceFilter = (range) => {
    setPriceRange(range);
    applyFilters(searchTerm, selectedCategory, range);
  };

  const applyFilters = (search, category, price) => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Price filter
    if (price.min !== "" && price.max !== "") {
      filtered = filtered.filter(
        (p) =>
          p.price >= parseFloat(price.min) && p.price <= parseFloat(price.max)
      );
    } else if (price.min !== "") {
      filtered = filtered.filter((p) => p.price >= parseFloat(price.min));
    } else if (price.max !== "") {
      filtered = filtered.filter((p) => p.price <= parseFloat(price.max));
    }

    setFilteredProducts(filtered);
  };

  const quickPriceFilters = [
    { label: "Under 50.000", min: 0, max: 50000 },
    { label: "50.000 - 100.000", min: 50000, max: 100000 },
    { label: "100.000 - 200.000", min: 100000, max: 200000 },
    { label: "Over 200.000", min: 200000, max: 999999 },
  ];

  const handleQuickPriceFilter = (filter) => {
    const range = { min: filter.min.toString(), max: filter.max.toString() };
    setPriceRange(range);
    applyFilters(searchTerm, selectedCategory, range);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Discover our complete collection of high-quality clothing
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for products, categories, or brands..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Category
                </h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="shirts">Shirts</option>
                  <option value="pants">Pants</option>
                  <option value="dresses">Dresses</option>
                  <option value="jackets">Jackets</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </h4>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      handlePriceFilter({ ...priceRange, min: e.target.value })
                    }
                    className="w-20 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-center"
                  />
                  <span className="text-gray-400 font-medium">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      handlePriceFilter({ ...priceRange, max: e.target.value })
                    }
                    className="w-20 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-center"
                  />
                </div>
              </div>

              {/* Quick Price Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Price Filters
                </h4>
                <div className="space-y-2">
                  {quickPriceFilters.map((filter, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPriceFilter(filter)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setPriceRange({ min: "", max: "" });
                  setSearchTerm("");
                  setFilteredProducts(products);
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredProducts.length}</span>{" "}
                products
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by</span>
                <select
                  value={sortBy}
                  onChange={handleSort}
                  className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Default</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.194-5.5-3M7 13a4 4 0 018 0v6a1 1 0 11-2 0v-6a2 2 0 00-4 0v6a1 1 0 11-2 0v-6z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    delay={index * 80}
                    className="transform hover:scale-105 transition-transform duration-200"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
