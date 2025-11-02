'use client';

import { CartItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface BillPreviewProps {
  cartItems: CartItem[];
}

export default function BillPreview({ cartItems }: BillPreviewProps) {
  const { getTotal } = useCart();
  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const date = new Date().toLocaleString();

  return (
    <div className="bill-print bg-white p-8 sm:p-10 max-w-2xl mx-auto">
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Sports Shop</h1>
        <p className="text-gray-600 font-medium">Billing Invoice</p>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Date: {date}
        </p>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2">Item</th>
            <th className="text-center py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((cartItem, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2">{cartItem.item.name}</td>
              <td className="text-center py-2">{cartItem.quantity}</td>
              <td className="text-right py-2">₹{cartItem.item.price.toFixed(2)}</td>
              <td className="text-right py-2">
                ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t-2 border-gray-300 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (10%):</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-2 mt-2">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
}
