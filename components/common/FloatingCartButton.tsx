'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function FloatingCartButton() {
  const { cart, getTotal } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = getTotal();

  // Prevent hydration mismatch by only rendering on client
  if (!isClient || itemCount === 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-40 no-print"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-modern-xl px-5 sm:px-7 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-300 transform hover:scale-110 animate-pulse-subtle border-2 border-blue-400">
        <div className="relative">
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg animate-bounce-subtle">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </div>
        <div className="flex flex-col hidden sm:block">
          <span className="text-xs font-medium opacity-90">Cart Total</span>
          <span className="text-lg font-bold">
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </Link>
  );
}
