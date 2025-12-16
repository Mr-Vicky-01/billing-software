import { MenuItem, CartItem, Transaction } from './types';

// API client functions for server-side data

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
    const response = await fetch(`${getBaseUrl()}/api/menu-items`, {
        cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch menu items');
    return response.json();
}

export async function addMenuItem(item: MenuItem): Promise<MenuItem> {
    const response = await fetch(`${getBaseUrl()}/api/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to add menu item');
    return response.json();
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const response = await fetch(`${getBaseUrl()}/api/menu-items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) throw new Error('Failed to update menu item');
    return response.json();
}

export async function deleteMenuItem(id: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/menu-items?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete menu item');
}

// Transactions
export async function getTransactions(year?: number, month?: number): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());

    const url = `${getBaseUrl()}/api/transactions${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
        cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
}

export async function saveTransaction(transaction: Transaction): Promise<Transaction> {
    const response = await fetch(`${getBaseUrl()}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to save transaction');
    return response.json();
}

// Settings
export async function getSettings(): Promise<{ qrCode: string }> {
    const response = await fetch(`${getBaseUrl()}/api/settings`, {
        cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
}

export async function saveSettings(settings: { qrCode: string }): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to save settings');
}

// Cart - Client-side only (localStorage)
export const getCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('sportsShop_cart');
    return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('sportsShop_cart', JSON.stringify(cart));
};

export const clearCart = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('sportsShop_cart');
};

// Helper function to get base URL
function getBaseUrl(): string {
    if (typeof window !== 'undefined') {
        // Client-side
        return '';
    }
    // Server-side
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
