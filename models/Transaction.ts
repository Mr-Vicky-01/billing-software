import mongoose, { Schema, Model } from 'mongoose';

interface ICartItem {
    item: {
        id: string;
        name: string;
        price: number;
        image: string;
        description?: string;
    };
    quantity: number;
}

export interface ITransaction {
    id: string;
    items: ICartItem[];
    total: number;
    date: string;
    timestamp: number;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        items: {
            type: [
                {
                    item: {
                        id: String,
                        name: String,
                        price: Number,
                        image: String,
                        description: String,
                    },
                    quantity: Number,
                },
            ],
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Number,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for efficient date-based queries
TransactionSchema.index({ timestamp: -1 });

// Prevent model recompilation in development
const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
