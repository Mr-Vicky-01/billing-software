import 'server-only';
import { MenuItem, Transaction } from './types';
import fs from 'fs/promises';
import path from 'path';

// Data directory path
const DATA_DIR = path.join(process.cwd(), 'data');

// File paths
const FILES = {
    MENU_ITEMS: path.join(DATA_DIR, 'menu-items.json'),
    TRANSACTIONS: path.join(DATA_DIR, 'transactions.json'),
    SETTINGS: path.join(DATA_DIR, 'settings.json'),
};

// Default menu items
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

// Initialize data directory and files
async function initializeStorage() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

        // Initialize menu items if not exists
        try {
            await fs.access(FILES.MENU_ITEMS);
        } catch {
            await fs.writeFile(FILES.MENU_ITEMS, JSON.stringify(DEFAULT_ITEMS, null, 2));
        }

        // Initialize transactions if not exists
        try {
            await fs.access(FILES.TRANSACTIONS);
        } catch {
            await fs.writeFile(FILES.TRANSACTIONS, JSON.stringify([], null, 2));
        }

        // Initialize settings if not exists
        try {
            await fs.access(FILES.SETTINGS);
        } catch {
            await fs.writeFile(FILES.SETTINGS, JSON.stringify({ qrCode: '' }, null, 2));
        }
    } catch (error) {
        console.error('Error initializing storage:', error);
        throw error;
    }
}

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
    await initializeStorage();
    try {
        const data = await fs.readFile(FILES.MENU_ITEMS, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading menu items:', error);
        return DEFAULT_ITEMS;
    }
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
    await initializeStorage();
    await fs.writeFile(FILES.MENU_ITEMS, JSON.stringify(items, null, 2));
}

export async function addMenuItem(item: MenuItem): Promise<MenuItem> {
    const items = await getMenuItems();
    items.push(item);
    await saveMenuItems(items);
    return item;
}

export async function updateMenuItem(id: string, updatedItem: Partial<MenuItem>): Promise<MenuItem | null> {
    const items = await getMenuItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem };
        await saveMenuItems(items);
        return items[index];
    }
    return null;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
    const items = await getMenuItems();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length < items.length) {
        await saveMenuItems(filtered);
        return true;
    }
    return false;
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
    await initializeStorage();
    try {
        const data = await fs.readFile(FILES.TRANSACTIONS, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions:', error);
        return [];
    }
}

export async function saveTransaction(transaction: Transaction): Promise<Transaction> {
    await initializeStorage();
    const transactions = await getTransactions();
    transactions.push(transaction);
    await fs.writeFile(FILES.TRANSACTIONS, JSON.stringify(transactions, null, 2));
    return transaction;
}

export async function getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
    const transactions = await getTransactions();
    return transactions.filter(t => {
        const date = new Date(t.timestamp);
        return date.getFullYear() === year && date.getMonth() === month;
    });
}

// Settings (QR Code)
export async function getSettings(): Promise<{ qrCode: string }> {
    await initializeStorage();
    try {
        const data = await fs.readFile(FILES.SETTINGS, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading settings:', error);
        return { qrCode: '' };
    }
}

export async function saveSettings(settings: { qrCode: string }): Promise<void> {
    await initializeStorage();
    await fs.writeFile(FILES.SETTINGS, JSON.stringify(settings, null, 2));
}
