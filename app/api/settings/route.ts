import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';

// Force dynamic - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/settings - Get settings (QR code)
export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json(settings, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            },
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

// POST /api/settings - Save settings (QR code)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        await saveSettings(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json(
            { error: 'Failed to save settings' },
            { status: 500 }
        );
    }
}
