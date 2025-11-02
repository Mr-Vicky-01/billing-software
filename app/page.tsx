'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/lib/types';
import { getMenuItems } from '@/lib/storage';
import MenuGrid from '@/components/Menu/MenuGrid';
import FloatingCartButton from '@/components/common/FloatingCartButton';

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadItems = () => {
      const menuItems = getMenuItems();
      setItems(menuItems);
    };

    loadItems();
    
    // Listen for storage changes (when items are updated from manage page)
    const handleStorageChange = () => {
      loadItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also check periodically in case of same-tab updates
    const interval = setInterval(loadItems, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-24 sm:pb-28">
        {/* Enhanced Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4 sm:mb-6 transform hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 bg-clip-text text-transparent">
              Our Products
            </span>
          </h1>
          
          {/* Subtitle with Icon */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              Browse our collection & add items to cart
            </p>
          </div>
          
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-blue-300"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-blue-300"></div>
          </div>
          
          {/* Item Count Badge */}
          {items.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm sm:text-base text-blue-700 font-medium shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{items.length} {items.length === 1 ? 'Product' : 'Products'} Available</span>
            </div>
          )}
        </div>
        
        <MenuGrid items={items} />
      </div>
      <FloatingCartButton />
    </>
  );
}
