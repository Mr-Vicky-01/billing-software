'use client';

import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  cartItem: CartItemType;
}

export default function CartItem({ cartItem }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { item, quantity } = cartItem;

  return (
    <div className="bg-white rounded-2xl shadow-professional border border-gray-100 p-5 sm:p-6 hover:shadow-modern-lg transition-all duration-300 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
        <div className="w-full sm:w-24 h-40 sm:h-24 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
        <div className="flex-grow w-full sm:w-auto min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm sm:text-base">₹{item.price.toFixed(2)} each</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="bg-white hover:bg-gray-50 text-gray-700 w-9 h-9 rounded-md font-bold text-base transition-all duration-200 shadow-sm hover:shadow active:scale-95"
            >
              −
            </button>
            <span className="w-12 text-center font-bold text-lg text-gray-900">{quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="bg-white hover:bg-gray-50 text-gray-700 w-9 h-9 rounded-md font-bold text-base transition-all duration-200 shadow-sm hover:shadow active:scale-95"
            >
              +
            </button>
          </div>
          <div className="w-20 sm:w-24 text-right">
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              ₹{(item.price * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="bg-red-500 hover:bg-red-600 active:scale-95 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm hover:shadow transition-all duration-200"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
