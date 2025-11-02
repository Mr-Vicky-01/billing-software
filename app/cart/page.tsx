'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/Cart/CartItem';
import CartSummary from '@/components/Cart/CartSummary';
import BillPreview from '@/components/Bill/BillPreview';

export default function CartPage() {
  const { cart, payNow, clearCart } = useCart();
  const [showPrintView, setShowPrintView] = useState(false);

  const handlePayNow = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (confirm('Confirm payment?')) {
      payNow();
      alert('Payment successful! Transaction saved.');
    }
  };

  const handlePrintBill = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8 text-center">Shopping Cart</h1>
      
      {showPrintView ? (
        <BillPreview cartItems={cart} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 order-2 lg:order-1">
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
                <p className="text-gray-500 text-base sm:text-lg mb-4">Your cart is empty</p>
                <a
                  href="/"
                  className="text-blue-600 hover:underline font-semibold"
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
  );
}
