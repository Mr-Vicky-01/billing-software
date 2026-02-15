import { CartItem } from '@/lib/types';

interface BillPreviewProps {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
}

export default function BillPreview({ items, total, subtotal, tax }: BillPreviewProps) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bill-print bg-white text-black p-8 max-w-md mx-auto font-body">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-amber-500">
        <h1 className="text-2xl font-bold font-display tracking-wide mb-1">Sports Shop</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Premium Sports Equipment</p>
        <p className="text-xs text-gray-400 mt-2">{currentDate}</p>
      </div>

      {/* Items */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-200 mb-3">
          <span>Item</span>
          <div className="flex gap-6">
            <span className="w-10 text-center">Qty</span>
            <span className="w-20 text-right">Amount</span>
          </div>
        </div>

        {items.map((cartItem) => (
          <div key={cartItem.item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
            <span className="flex-1 pr-2 truncate font-medium">{cartItem.item.name}</span>
            <div className="flex gap-6">
              <span className="w-10 text-center text-gray-600">{cartItem.quantity}</span>
              <span className="w-20 text-right font-medium">
                ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-300 pt-3 space-y-1.5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t-2 border-black">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Thank you for your purchase!</p>
        <p className="text-xs text-gray-400 mt-1">Visit us again</p>
      </div>
    </div>
  );
}
