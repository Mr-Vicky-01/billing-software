'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import PaymentModal from '@/components/Payment/PaymentModal';

interface CartSummaryProps {
  onPayNow: () => void;
  onPrintBill: () => void;
  onClearCart: () => void;
}

export default function CartSummary({
  onPayNow,
  onPrintBill,
  onClearCart,
}: CartSummaryProps) {
  const { cart, getTotal } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const total = getTotal();
  const subtotal = total;
  const tax = total * 0.1; // 10% tax
  const finalTotal = subtotal + tax;

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);
    onPayNow();
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-modern-lg p-6 sm:p-8 text-center border border-gray-100">
        <p className="text-gray-500 text-lg font-medium mb-4">Your cart is empty</p>
        <a
          href="/"
          className="text-blue-600 hover:text-blue-700 font-semibold text-base hover:underline"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-100 p-6 sm:p-8 sticky top-24 animate-slide-up">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Bill Summary</h2>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
          <span className="font-medium">Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
          <span className="font-medium">Tax (10%):</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="border-t-2 pt-3 mt-4">
          <div className="flex justify-between text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            <span>Total:</span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:scale-95 text-white font-bold py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl transition-all duration-200 text-base sm:text-lg shadow-md hover:shadow-lg"
        >
          💳 Pay Now
        </button>
        <button
          onClick={onPrintBill}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-bold py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl transition-all duration-200 text-base sm:text-lg shadow-md hover:shadow-lg"
        >
          🖨️ Print Bill
        </button>
        <button
          onClick={onClearCart}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-95 text-white font-bold py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl transition-all duration-200 text-base sm:text-lg shadow-md hover:shadow-lg"
        >
          🗑️ Clear Cart
        </button>
      </div>
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        total={finalTotal}
      />
    </div>
  );
}
