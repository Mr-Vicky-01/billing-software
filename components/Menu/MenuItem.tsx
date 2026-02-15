'use client';

import Image from 'next/image';
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
      className="group dark-card rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.03] hover-glow flex flex-col h-full"
    >
      <div className="relative h-40 sm:h-48 md:h-56 bg-dark-200 overflow-hidden flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-200">
            <svg className="w-12 h-12 text-ivory-dim opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-400/80 via-dark-400/20 to-transparent" />
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold text-ivory mb-2 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-ivory-muted text-xs sm:text-sm mb-3 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.25rem]">
          {item.description || '\u00A0'}
        </p>
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-dark-50/30 mt-auto">
          <span className="text-2xl sm:text-3xl font-bold text-accent">
            ₹{item.price.toLocaleString('en-IN')}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
            className="btn-accent px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base active:scale-95 whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
