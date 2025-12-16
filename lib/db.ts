import 'server-only';
import { MenuItem, Transaction } from './types';
import connectDB from './mongodb';
import MenuItemModel from '../models/MenuItem';
import TransactionModel from '../models/Transaction';
import SettingsModel from '../models/Settings';

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

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
    try {
        await connectDB();
        const items = await MenuItemModel.find({}).lean();

        // Initialize with default items if no items exist
        if (items.length === 0) {
            await MenuItemModel.insertMany(DEFAULT_ITEMS);
            return DEFAULT_ITEMS;
        }

        // Convert MongoDB documents to MenuItem type
        return items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description,
        }));
    } catch (error) {
        console.error('Error reading menu items:', error);
        return DEFAULT_ITEMS;
    }
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
    await connectDB();
    // Delete all existing items and insert new ones
    await MenuItemModel.deleteMany({});
    await MenuItemModel.insertMany(items);
}

export async function addMenuItem(item: MenuItem): Promise<MenuItem> {
    await connectDB();
    const newItem = await MenuItemModel.create(item);
    return {
        id: newItem.id,
        name: newItem.name,
        price: newItem.price,
        image: newItem.image,
        description: newItem.description,
    };
}

export async function updateMenuItem(id: string, updatedItem: Partial<MenuItem>): Promise<MenuItem | null> {
    await connectDB();
    const updated = await MenuItemModel.findOneAndUpdate(
        { id },
        { $set: updatedItem },
        { new: true }
    ).lean();

    if (!updated) return null;

    return {
        id: updated.id,
        name: updated.name,
        price: updated.price,
        image: updated.image,
        description: updated.description,
    };
}

export async function deleteMenuItem(id: string): Promise<boolean> {
    await connectDB();
    const result = await MenuItemModel.deleteOne({ id });
    return result.deletedCount > 0;
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
    try {
        await connectDB();
        const transactions = await TransactionModel.find({})
            .sort({ timestamp: -1 })
            .lean();

        return transactions.map(t => ({
            id: t.id,
            items: t.items,
            total: t.total,
            date: t.date,
            timestamp: t.timestamp,
        }));
    } catch (error) {
        console.error('Error reading transactions:', error);
        return [];
    }
}

export async function saveTransaction(transaction: Transaction): Promise<Transaction> {
    await connectDB();
    const newTransaction = await TransactionModel.create(transaction);
    return {
        id: newTransaction.id,
        items: newTransaction.items,
        total: newTransaction.total,
        date: newTransaction.date,
        timestamp: newTransaction.timestamp,
    };
}

export async function getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
    await connectDB();
    const transactions = await getTransactions();
    return transactions.filter(t => {
        const date = new Date(t.timestamp);
        return date.getFullYear() === year && date.getMonth() === month;
    });
}

// Settings (QR Code)
export async function getSettings(): Promise<{ qrCode: string }> {
    try {
        await connectDB();
        // Get or create the singleton settings document
        let settings = await SettingsModel.findOne({}).lean();

        if (!settings) {
            settings = await SettingsModel.create({ qrCode: '' });
        }

        return { qrCode: settings.qrCode || '' };
    } catch (error) {
        console.error('Error reading settings:', error);
        return { qrCode: '' };
    }
}

export async function saveSettings(settings: { qrCode: string }): Promise<void> {
    await connectDB();
    // Update or create the singleton settings document
    await SettingsModel.findOneAndUpdate(
        {},
        { $set: { qrCode: settings.qrCode } },
        { upsert: true, new: true }
    );
}
