'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { CartItem as CartItemType } from '@/lib/types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { quantity } = item;
  const menuItem = item.item;

  return (
    <div className="dark-card rounded-2xl p-5 sm:p-6 shadow-dark transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
        {/* Image */}
        <div className="relative w-full sm:w-20 h-32 sm:h-20 rounded-xl overflow-hidden bg-dark-200 flex-shrink-0 border border-dark-50/20">
          {menuItem.image ? (
            <Image
              src={menuItem.image}
              alt={menuItem.name}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-ivory-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Name & Price */}
        <div className="flex-grow min-w-0">
          <h3 className="font-bold text-ivory text-lg mb-1 truncate">{menuItem.name}</h3>
          <p className="text-ivory-dim text-sm">₹{menuItem.price.toFixed(2)} each</p>
        </div>

        {/* Quantity & Actions */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-dark-300 rounded-xl p-1 border border-dark-50/20">
            <button
              onClick={() => updateQuantity(menuItem.id, quantity - 1)}
              className="bg-dark-200 hover:bg-dark-100 text-ivory w-9 h-9 rounded-lg font-bold text-base transition-all duration-200 shadow-dark hover:shadow-dark-lg active:scale-95 border border-dark-50/30 hover:border-accent/30 hover:text-accent"
            >
              −
            </button>
            <span className="w-12 text-center font-bold text-lg text-ivory">{quantity}</span>
            <button
              onClick={() => updateQuantity(menuItem.id, quantity + 1)}
              className="bg-dark-200 hover:bg-dark-100 text-ivory w-9 h-9 rounded-lg font-bold text-base transition-all duration-200 shadow-dark hover:shadow-dark-lg active:scale-95 border border-dark-50/30 hover:border-accent/30 hover:text-accent"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right min-w-[85px]">
            <p className="text-xs text-ivory-dim mb-0.5 uppercase tracking-wider">Subtotal</p>
            <p className="font-bold text-lg text-accent">₹{(menuItem.price * quantity).toFixed(2)}</p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeFromCart(menuItem.id)}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-dark-200 border border-dark-50/30 hover:border-red-500/30 hover:bg-red-500/10 text-ivory-dim hover:text-red-400 transition-all duration-200 shadow-dark"
            aria-label="Remove item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Remove Button */}
      <div className="sm:hidden mt-4 flex justify-end">
        <button
          onClick={() => removeFromCart(menuItem.id)}
          className="flex items-center gap-2 px-4 py-2 btn-danger rounded-lg text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}
