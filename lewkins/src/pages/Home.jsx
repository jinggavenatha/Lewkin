import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      price: 55000,
      category: "T-Shirts",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
      description: "A comfortable and stylish white t-shirt made from 100% cotton.",
      colors: ["White", "Black", "Gray"],
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "Denim Jacket",
      price: 128000,
      category: "Jackets",
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
      description: "A trendy denim jacket perfect for casual outings.",
      colors: ["Blue", "Black"],
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "Summer Dress",
      price: 230000,
      category: "Dresses",
      image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg",
      description: "A beautiful summer dress for warm weather.",
      colors: ["Red", "Blue", "Yellow"],
      sizes: ["XS", "S", "M", "L"]
    },
    {
      id: 4,
      name: "Casual Jeans",
      price: 70000,
      category: "Jeans",
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
      description: "Comfortable casual jeans for everyday wear.",
      colors: ["Blue", "Black"],
      sizes: ["28", "30", "32", "34", "36"]
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Your Style</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Shop the latest fashion trends with our curated collection of high-quality clothing.
            </p>
            <div className="space-x-4">
              <Link
                to="/products"
                className="bg-white text-black px-8 py-4 text-lg font-bold hover:bg-gray-100 transition-colors duration-200"
              >
                Shop Now
              </Link>
              <Link
                to="/products"
                className="border-2 border-white text-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-gray-900 transition-colors duration-200"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Lewkin Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Lewkin?</h2>
            <p className="text-gray-600 text-lg">
              We provide the best shopping experience with quality products and excellent service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-truck text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Free shipping on orders over $50. Get your items delivered quickly and safely.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-star text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Quality Products</h3>
              <p className="text-gray-600">
                Carefully curated collection of high-quality clothing from trusted brands.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shield-alt text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Secure Payment</h3>
              <p className="text-gray-600">
                Safe and secure payment processing with multiple payment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">
              Explore our best-selling and highly rated clothing selections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <ProductCard product={product} delay={index * 200} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* View All Products Button */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Link
            to="/products"
            className="inline-block bg-black text-white px-8 py-4 text-lg font-medium rounded hover:bg-gray-800 transition-colors duration-200"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter and be the first to know about new arrivals and exclusive offers
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-auto px-6 py-3 rounded-md text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 px-6 py-3 rounded-md font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
