'use client';

import { MenuItem as MenuItemType } from '@/lib/types';
import MenuItem from './MenuItem';

interface MenuGridProps {
  items: MenuItemType[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-100 p-8 sm:p-12 text-center">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 00.586 13H4" />
        </svg>
        <p className="text-gray-500 text-lg font-medium mb-4">No items in the menu.</p>
        <a
          href="/manage"
          className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
        >
          Go to Manage Menu
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
