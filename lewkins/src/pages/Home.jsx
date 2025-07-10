import React from 'react';
import { Link } from 'react-router-dom';
import section1 from '../assets/section1.jpg';
import section2 from '../assets/section2.jpg';

export default function Home() {
  return (
    <div className="full-width">
            {/* Hero Section with Video */}
      <Link to="/products" className="block">
        <section className="relative w-full h-screen overflow-hidden cursor-pointer">
          <video 
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/src/assets/Hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Overlay Text */}
          <div className="absolute bottom-20 left-8 text-white z-10">
            <div className="text-lg md:text-xl font-medium tracking-wider uppercase opacity-90 mb-2">
              WOMEN COLLECTIONS
            </div>
            <div className="text-6xl md:text-8xl font-bold tracking-tight">
              NEWEST
            </div>
          </div>
        </section>
      </Link>

      {/* Spacing */}
      <div className="h-20" />

      {/* Section 1 */}
      <Link to="/products" className="block">
        <section className="relative w-full h-screen overflow-hidden cursor-pointer">
          <img 
            src={section1} 
            alt="Section 1" 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Text */}
          <div className="absolute bottom-20 left-8 text-white z-10">
            <div className="text-lg md:text-xl font-medium tracking-wider uppercase opacity-90 mb-2">
              TRENDY
            </div>
            <div className="text-6xl md:text-8xl font-bold tracking-tight">
              WOMEN COLLECTIONS
            </div>
          </div>
        </section>
      </Link>

      {/* Spacing */}
      <div className="h-20" />

      {/* Section 2 */}
      <Link to="/products" className="block">
        <section className="relative w-full h-screen overflow-hidden cursor-pointer">
          <img 
            src={section2} 
            alt="Section 2" 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Text */}
          <div className="absolute bottom-20 left-8 text-white z-10">
            <div className="text-lg md:text-xl font-medium tracking-wider uppercase opacity-90 mb-2">
              TRENDY
            </div>
            <div className="text-6xl md:text-8xl font-bold tracking-tight">
              BOYS COLLECTIONS
            </div>
          </div>
        </section>
      </Link>
    </div>
  );
}
