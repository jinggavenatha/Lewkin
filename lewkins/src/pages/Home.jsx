import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      price: 25.99,
      category: "T-Shirts",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
      description: "A comfortable and stylish white t-shirt made from 100% cotton.",
      colors: ["White", "Black", "Gray"]
    },
    {
      id: 2,
      name: "Denim Jacket",
      price: 79.99,
      category: "Jackets",
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
      description: "A trendy denim jacket perfect for casual outings.",
      colors: ["Blue", "Black"]
    },
    {
      id: 3,
      name: "Summer Dress",
      price: 45.99,
      category: "Dresses",
      image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg",
      description: "A beautiful summer dress for warm weather.",
      colors: ["Red", "Blue", "Yellow"]
    },
    {
      id: 4,
      name: "Casual Jeans",
      price: 59.99,
      category: "Jeans",
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
      description: "Comfortable casual jeans for everyday wear.",
      colors: ["Blue", "Black"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">Discover Your Style</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Shop the latest fashion trends with our curated collection of high-quality clothing
            </p>
            <div className="space-x-4">
              <Link to="/login" className="bg-white text-black px-8 py-4 text-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                Shop Now
              </Link>
              <Link to="/register" className="border-2 border-white text-white px-8 py-4 text-lg font-medium hover:bg-white hover:text-black transition-colors duration-200">
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Check out our most popular items that customers love</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </Link>
                    <Link to="/login" className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center">
                      <i className="fas fa-shopping-cart mr-2"></i>
                      Add to Cart
                    </Link>
                  </div>
                  
                  <div className="flex space-x-2">
                    {product.colors.map((color, index) => (
                      <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Lewkin Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Lewkin?</h2>
            <p className="text-gray-600 text-lg">We provide the best shopping experience with quality products and excellent service</p>
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
    </div>
  );
}
