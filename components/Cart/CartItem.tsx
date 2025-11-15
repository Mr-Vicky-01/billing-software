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
    <div className="bg-white rounded-2xl shadow-modern border border-gray-100/50 p-4 sm:p-5 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-full sm:w-20 h-40 sm:h-20 bg-gray-200 rounded flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
        <div className="flex-grow w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm sm:text-base">₹{item.price.toFixed(2)} each</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 shadow-modern hover:shadow-modern-lg hover-lift"
            >
              −
            </button>
            <span className="w-12 sm:w-14 text-center font-semibold text-base sm:text-lg px-2">{quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 shadow-modern hover:shadow-modern-lg hover-lift"
            >
              +
            </button>
          </div>
          <div className="w-20 sm:w-24 text-right">
            <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              ₹{(item.price * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-modern hover:shadow-modern-lg transition-all duration-200 hover-lift"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
