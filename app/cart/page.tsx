'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import CartItem from '@/components/Cart/CartItem';
import CartSummary from '@/components/Cart/CartSummary';
import BillPreview from '@/components/Bill/BillPreview';

export default function CartPage() {
  const { cart, payNow, clearCart } = useCart();
  const { showToast } = useToast();
  const [showPrintView, setShowPrintView] = useState(false);

  const handlePayNow = () => {
    payNow();
  };

  const handlePrintBill = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-mesh">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-32">
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-glass border border-white/50 animate-fade-in">
            <div className="bg-primary-50 p-2 rounded-xl">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-800 to-slate-900 animate-gradient">
              Shopping Cart
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Review your selected items and proceed to checkout
          </p>
        </div>

        {showPrintView ? (
          <BillPreview cartItems={cart} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
              {cart.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center border border-white/50">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Your cart is empty</h3>
                  <p className="text-slate-500 text-lg mb-8">Looks like you haven't added any items yet.</p>
                  <a
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-1"
                  >
                    Start Shopping
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((cartItem) => (
                    <div key={cartItem.item.id} className="glass-card rounded-2xl p-4 sm:p-6 hover-lift border border-white/50 transition-all duration-300">
                      <CartItem cartItem={cartItem} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <div className="sticky top-24">
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/50 shadow-glass-lg">
                  <CartSummary
                    onPayNow={handlePayNow}
                    onPrintBill={handlePrintBill}
                    onClearCart={handleClearCart}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
