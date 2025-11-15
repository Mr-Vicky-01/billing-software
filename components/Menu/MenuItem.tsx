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
      className="group bg-white rounded-2xl shadow-professional overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-modern-lg border border-gray-100 hover:border-blue-200 animate-fade-in"
    >
      <div className="relative h-40 sm:h-48 md:h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <svg className="w-12 h-12 text-gray-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 h-10 sm:h-9">{item.description}</p>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 pt-3 border-t border-gray-100">
          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            ₹{item.price.toLocaleString('en-IN')}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm sm:text-base"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
