import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} lewkins. All rights reserved.</p>
        <p className="text-xs mt-2">Designed with modern minimalism and user-friendly experience.</p>
      </div>
    </footer>
  );
}
