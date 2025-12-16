import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, saveTransaction, getTransactionsByMonth } from '@/lib/db';
import { Transaction } from '@/lib/types';

// GET /api/transactions - Get transactions (optionally filtered by month)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        let transactions: Transaction[];

        if (year && month) {
            transactions = await getTransactionsByMonth(
                parseInt(year),
                parseInt(month)
            );
        } else {
            transactions = await getTransactions();
        }

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newTransaction = await saveTransaction(body as Transaction);
        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        );
    }
}
