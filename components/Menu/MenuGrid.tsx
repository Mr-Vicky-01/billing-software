'use client';

import { MenuItem as MenuItemType } from '@/lib/types';
import MenuItem from './MenuItem';

interface MenuGridProps {
  items: MenuItemType[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No items in the menu.</p>
        <p className="text-gray-400 mt-2">
          Go to <a href="/manage" className="text-blue-600 hover:underline">Manage Menu</a> to add items.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
