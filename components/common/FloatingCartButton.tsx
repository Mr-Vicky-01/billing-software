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
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 no-print"
    >
      <div className="glass-card !bg-white/90 !backdrop-blur-xl px-6 py-3 rounded-full shadow-glass-lg flex items-center gap-4 hover-lift border border-white/60 ring-1 ring-black/5 group transition-all duration-300 hover:scale-105">
        <div className="relative">
          <div className="bg-primary-50 p-2 rounded-full group-hover:bg-primary-100 transition-colors">
            <svg
              className="w-6 h-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm animate-bounce-subtle">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </div>

        <div className="flex flex-col pr-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
          <span className="text-lg font-bold text-slate-800 leading-none">
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
