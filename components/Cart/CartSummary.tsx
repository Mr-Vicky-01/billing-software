'use client';

import { useCart } from '@/context/CartContext';

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
  const total = getTotal();
  const subtotal = total;
  const tax = total * 0.1; // 10% tax
  const finalTotal = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <a
          href="/"
          className="text-blue-600 hover:underline"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-professional-lg border border-gray-200 p-5 sm:p-6 sticky top-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Bill Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Tax (10%):</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-4">
          <div className="flex justify-between text-lg sm:text-xl font-bold">
            <span>Total:</span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
        <button
          onClick={onPayNow}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 sm:py-3.5 px-5 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
        >
          Pay Now
        </button>
        <button
          onClick={onPrintBill}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 sm:py-3.5 px-5 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
        >
          Print Bill
        </button>
        <button
          onClick={onClearCart}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 sm:py-3.5 px-5 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
