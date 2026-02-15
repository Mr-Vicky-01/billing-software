'use client';

import { MenuItem as MenuItemType } from '@/lib/types';
import MenuItem from './MenuItem';

interface MenuGridProps {
  items: MenuItemType[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="dark-card-static rounded-3xl p-12 text-center max-w-lg mx-auto mt-8">
        <div className="w-24 h-24 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-ivory-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 00.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-ivory mb-2">No items found</h3>
        <p className="text-ivory-muted mb-8">It looks like there are no products available at the moment.</p>
        <a
          href="/manage"
          className="btn-accent inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm"
        >
          Manage Inventory
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {items.map((item, index) => (
        <div key={item.id} className={`animate-reveal-up stagger-${Math.min(index + 1, 8)}`}>
          <MenuItem item={item} />
        </div>
      ))}
    </div>
  );
}
