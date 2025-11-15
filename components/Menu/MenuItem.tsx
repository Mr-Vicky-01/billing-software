'use client';

import { MenuItem as MenuItemType } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart();

  const handleClick = () => {
    addToCart(item);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-modern overflow-hidden cursor-pointer hover-lift border border-gray-100/50 animate-fade-in"
    >
      <div className="relative h-32 sm:h-40 md:h-48 bg-gray-200">
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
            <span className="text-gray-500 text-sm sm:text-lg">No Image</span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{item.description}</p>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            ₹{item.price.toLocaleString('en-IN')}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-modern hover:shadow-modern-lg font-semibold text-sm sm:text-base hover-lift"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
