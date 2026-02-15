'use client';

import { useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import PaymentModal from '@/components/Payment/PaymentModal';
import BillPreview from '@/components/Bill/BillPreview';

export default function CartSummary() {
  const { cart, getTotal, clearCart, payNow: processPayment } = useCart();
  const billRef = useRef<HTMLDivElement>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const subtotal = getTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  const handlePayment = async () => {
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    await processPayment();
    setShowPaymentModal(false);
    handlePrint();
  };

  return (
    <>
      <div className="dark-card-static rounded-3xl p-6 sm:p-8 shadow-dark-lg sticky top-24">
        <h2 className="text-xl font-bold text-ivory mb-6 flex items-center gap-3">
          <span className="w-1 h-6 bg-accent rounded-full" />
          Order Summary
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-ivory-muted">
            <span>Subtotal</span>
            <span className="font-semibold text-ivory">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-ivory-muted">
            <span>Tax (5%)</span>
            <span className="font-semibold text-ivory">₹{tax.toFixed(2)}</span>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-dark-50/50 to-transparent my-4" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-ivory">Total</span>
            <span className="text-2xl font-black text-accent">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePayment}
            className="w-full btn-accent py-3.5 rounded-xl text-base flex items-center justify-center gap-2 active:scale-[0.98]"
            disabled={cart.length === 0}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Pay Now
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrint}
              className="btn-dark py-3 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
              disabled={cart.length === 0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Bill
            </button>

            <button
              onClick={clearCart}
              className="btn-danger py-3 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
              disabled={cart.length === 0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          total={total}
          onConfirm={confirmPayment}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}

      {/* Hidden Bill Preview for printing */}
      <div className="hidden">
        <div ref={billRef}>
          <BillPreview items={cart} total={total} subtotal={subtotal} tax={tax} />
        </div>
      </div>
    </>
  );
}
