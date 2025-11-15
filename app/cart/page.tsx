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
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 pb-24 sm:pb-28">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-blue-300"></div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Shopping Cart
              </span>
            </h1>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-blue-300"></div>
          </div>
        </div>
        
        {showPrintView ? (
          <BillPreview cartItems={cart} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-5 order-2 lg:order-1">
              {cart.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-modern-lg p-8 sm:p-12 text-center border border-gray-100">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg sm:text-xl font-medium mb-4">Your cart is empty</p>
                  <a
                    href="/"
                    className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Continue Shopping
                  </a>
                </div>
              ) : (
                cart.map((cartItem) => (
                  <CartItem key={cartItem.item.id} cartItem={cartItem} />
                ))
              )}
            </div>
            
            <div className="order-1 lg:order-2">
              <CartSummary
                onPayNow={handlePayNow}
                onPrintBill={handlePrintBill}
                onClearCart={handleClearCart}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
