import { NextRequest, NextResponse } from 'next/server';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/db';
import { MenuItem } from '@/lib/types';

// GET /api/menu-items - Get all menu items
export async function GET() {
    try {
        const items = await getMenuItems();
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu items' },
            { status: 500 }
        );
    }
}

// POST /api/menu-items - Add a new menu item
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newItem = await addMenuItem(body as MenuItem);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Error adding menu item:', error);
        return NextResponse.json(
            { error: 'Failed to add menu item' },
            { status: 500 }
        );
    }
}

// PUT /api/menu-items - Update a menu item
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Menu item ID is required' },
                { status: 400 }
            );
        }

        const updatedItem = await updateMenuItem(id, updates);

        if (!updatedItem) {
            return NextResponse.json(
                { error: 'Menu item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json(
            { error: 'Failed to update menu item' },
            { status: 500 }
        );
    }
}

// DELETE /api/menu-items - Delete a menu item
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Menu item ID is required' },
                { status: 400 }
            );
        }

        const deleted = await deleteMenuItem(id);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Menu item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json(
            { error: 'Failed to delete menu item' },
            { status: 500 }
        );
    }
}
