'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function FloatingCartButton() {
  const { cart, getTotal } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = getTotal();

  if (itemCount === 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 no-print"
    >
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl shadow-modern-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 hover-lift active:scale-95 border border-white/20 backdrop-blur-sm">
        <div className="relative">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90">Total</span>
          <span className="text-lg font-bold">
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="ml-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
