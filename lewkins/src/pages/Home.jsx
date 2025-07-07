// Component inspired by Tom Miller from the GSAP community
// https://codepen.io/creativeocean/pen/NPWLwJM

import React from 'react';
import { Link } from 'react-router-dom';
import TrueFocus from '../../reactbits/TrueFocus/TrueFocus';
import ScrambledText from '../../reactbits/ScrambledText/ScrambledText';
import BlurText from '../../reactbits/BlurText/BlurText';
import ShinyText from '../../reactbits/ShinyText/ShinyText';
import SplitText from '../../reactbits/SplitText/SplitText';
import ProductCard from '../components/ProductCard';

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

  const handleAnimationComplete = () => {
    console.log('Featured products title animation completed!');
  };

  const handleSplitTextComplete = () => {
    console.log('All letters have animated!');
  };

  const handleBlurTextComplete = () => {
    console.log('Animation completed!');
  };

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
            <TrueFocus 
              sentence="Discover Your Style"
              manualMode={false}
              blurAmount={5}
              borderColor="black"
              animationDuration={2}
              pauseBetweenAnimations={1}
            />
            <ScrambledText
              className="scrambled-text-demo text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              radius={100}
              duration={1.2}
              speed={0.5}
              scrambleChars=".:"
            >
              Shop the latest fashion trends with our curated collection of high-quality clothing
            </ScrambledText>
            <div className="space-x-4">
              <Link to="/products" className="bg-white text-black px-8 py-4 text-lg font-bold hover:bg-gray-100 transition-colors duration-200">
                <ShinyText text="Shop Now" disabled={false} speed={3} className="font-bold" color="#000000" />
              </Link>
              <Link to="/products" className="border-2 border-white text-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-gray-900 transition-colors duration-200">
                <ShinyText text="Browse Collection" disabled={false} speed={3} className="font-bold text-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <BlurText
              text="Check out our most popular items that customers love"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-3xl font-bold mb-4"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index * 200} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Lewkin Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SplitText
              text="You'll ❤️ to shop at voila.id"
              className="text-4xl font-bold mb-4"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleSplitTextComplete}
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
                             <SplitText
                 text="100% Authentic"
                 className="text-xl font-bold mb-3 text-gray-900"
                 delay={100}
                 duration={0.6}
                 ease="power3.out"
                 splitType="chars"
                 from={{ opacity: 0, y: 40 }}
                 to={{ opacity: 1, y: 0 }}
                 threshold={0.1}
                 rootMargin="-100px"
                 textAlign="left"
                 onLetterAnimationComplete={handleSplitTextComplete}
               />
                             <BlurText
                 text="Dedicated to providing genuine luxury products that uphold the highest standards of quality."
                 delay={150}
                 animateBy="words"
                 direction="top"
                 onAnimationComplete={handleBlurTextComplete}
                 className="text-gray-600 text-sm leading-relaxed"
               />
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
                             <SplitText
                 text="Extensive Collection"
                 className="text-xl font-bold mb-3 text-gray-900"
                 delay={100}
                 duration={0.6}
                 ease="power3.out"
                 splitType="chars"
                 from={{ opacity: 0, y: 40 }}
                 to={{ opacity: 1, y: 0 }}
                 threshold={0.1}
                 rootMargin="-100px"
                 textAlign="left"
                 onLetterAnimationComplete={handleSplitTextComplete}
               />
                             <BlurText
                 text="Presenting a meticulously curated selection of over 150 luxury brands, all under one roof."
                 delay={150}
                 animateBy="words"
                 direction="top"
                 onAnimationComplete={handleBlurTextComplete}
                 className="text-gray-600 text-sm leading-relaxed"
               />
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
              </div>
                             <SplitText
                 text="Competitive Prices"
                 className="text-xl font-bold mb-3 text-gray-900"
                 delay={100}
                 duration={0.6}
                 ease="power3.out"
                 splitType="chars"
                 from={{ opacity: 0, y: 40 }}
                 to={{ opacity: 1, y: 0 }}
                 threshold={0.1}
                 rootMargin="-100px"
                 textAlign="left"
                 onLetterAnimationComplete={handleSplitTextComplete}
               />
                             <BlurText
                 text="Bringing you the most competitive prices in the luxury market."
                 delay={150}
                 animateBy="words"
                 direction="top"
                 onAnimationComplete={handleBlurTextComplete}
                 className="text-gray-600 text-sm leading-relaxed"
               />
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
                             <SplitText
                 text="Seamless Shopping Experience"
                 className="text-xl font-bold mb-3 text-gray-900"
                 delay={100}
                 duration={0.6}
                 ease="power3.out"
                 splitType="chars"
                 from={{ opacity: 0, y: 40 }}
                 to={{ opacity: 1, y: 0 }}
                 threshold={0.1}
                 rootMargin="-100px"
                 textAlign="left"
                 onLetterAnimationComplete={handleSplitTextComplete}
               />
                             <BlurText
                 text="Effortlessly bridging the gap between online and offline shopping."
                 delay={150}
                 animateBy="words"
                 direction="top"
                 onAnimationComplete={handleBlurTextComplete}
                 className="text-gray-600 text-sm leading-relaxed"
               />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
