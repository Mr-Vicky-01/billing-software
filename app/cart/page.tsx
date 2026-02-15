'use client';

import Link from 'next/link';
import CartItem from '@/components/Cart/CartItem';
import CartSummary from '@/components/Cart/CartSummary';
import FloatingCartButton from '@/components/common/FloatingCartButton';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart } = useCart();

  return (
    <>
      <div className="min-h-screen bg-dark-mesh">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-32">
          {/* Page Header */}
          <div className="mb-10 sm:mb-14 text-center">
            <div className="inline-flex items-center justify-center p-3 mb-6 bg-dark-200/60 backdrop-blur-sm rounded-2xl shadow-dark border border-dark-50/30 animate-reveal-up">
              <div className="bg-accent/10 p-2 rounded-xl">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 animate-reveal-up stagger-1">
              <span className="text-gold-gradient">Shopping Cart</span>
            </h1>
            <p className="text-lg text-ivory-muted max-w-2xl mx-auto animate-reveal-up stagger-2">
              Review your items and proceed to checkout
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="dark-card-static rounded-3xl p-12 text-center max-w-lg mx-auto animate-reveal-up stagger-3">
              <div className="w-24 h-24 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-ivory-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ivory mb-2">Your cart is empty</h3>
              <p className="text-ivory-muted mb-8">
                Explore our collection and add some premium gear to your cart.
              </p>
              <Link
                href="/"
                className="btn-accent inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <div key={item.item.id} className={`animate-reveal-up stagger-${Math.min(index + 1, 8)}`}>
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
              <div className="animate-reveal-up stagger-3">
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </div>
      <FloatingCartButton />
    </>
  );
}
