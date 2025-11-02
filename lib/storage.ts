import { MenuItem, CartItem, Transaction } from './types';

const STORAGE_KEYS = {
  MENU_ITEMS: 'sportsShop_menuItems',
  CART: 'sportsShop_cart',
  TRANSACTIONS: 'sportsShop_transactions',
};

// Default menu items with images
const DEFAULT_ITEMS: MenuItem[] = [
  {
    id: 'item_1',
    name: 'Football',
    price: 1299,
    image: 'https://picsum.photos/seed/football/400/300',
    description: 'Official size 5 football, perfect for matches',
  },
  {
    id: 'item_2',
    name: 'Basketball',
    price: 1599,
    image: 'https://picsum.photos/seed/basketball/400/300',
    description: 'Premium basketball with excellent grip',
  },
  {
    id: 'item_3',
    name: 'Tennis Racket',
    price: 4499,
    image: 'https://picsum.photos/seed/tennis/400/300',
    description: 'Professional tennis racket for all skill levels',
  },
  {
    id: 'item_4',
    name: 'Running Shoes',
    price: 6499,
    image: 'https://picsum.photos/seed/shoes/400/300',
    description: 'Comfortable running shoes with excellent cushioning',
  },
  {
    id: 'item_5',
    name: 'Yoga Mat',
    price: 1249,
    image: 'https://picsum.photos/seed/yoga/400/300',
    description: 'Non-slip yoga mat for your workouts',
  },
  {
    id: 'item_6',
    name: 'Dumbbells Set',
    price: 3999,
    image: 'https://picsum.photos/seed/dumbbell/400/300',
    description: 'Adjustable dumbbells set (5kg-20kg)',
  },
  {
    id: 'item_7',
    name: 'Soccer Jersey',
    price: 2299,
    image: 'https://picsum.photos/seed/jersey/400/300',
    description: 'Official team jersey, 100% polyester',
  },
  {
    id: 'item_8',
    name: 'Bicycle Helmet',
    price: 2999,
    image: 'https://picsum.photos/seed/helmet/400/300',
    description: 'Safety-certified bicycle helmet',
  },
];

// Menu Items
export const getMenuItems = (): MenuItem[] => {
  if (typeof window === 'undefined') return [];
  const items = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
  if (!items) {
    // Initialize with default items if no items exist
    saveMenuItems(DEFAULT_ITEMS);
    return DEFAULT_ITEMS;
  }
  return JSON.parse(items);
};

export const saveMenuItems = (items: MenuItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
};

export const addMenuItem = (item: MenuItem): void => {
  const items = getMenuItems();
  items.push(item);
  saveMenuItems(items);
};

export const updateMenuItem = (id: string, updatedItem: Partial<MenuItem>): void => {
  const items = getMenuItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem };
    saveMenuItems(items);
  }
};

export const deleteMenuItem = (id: string): void => {
  const items = getMenuItems();
  const filtered = items.filter(item => item.id !== id);
  saveMenuItems(filtered);
};

// Cart
export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(STORAGE_KEYS.CART);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CART);
};

// Transactions
export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return transactions ? JSON.parse(transactions) : [];
};

export const saveTransaction = (transaction: Transaction): void => {
  if (typeof window === 'undefined') return;
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getTransactionsByMonth = (year: number, month: number): Transaction[] => {
  const transactions = getTransactions();
  return transactions.filter(t => {
    const date = new Date(t.timestamp);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};
