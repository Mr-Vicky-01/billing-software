import mongoose, { Schema, Model } from 'mongoose';

export interface IMenuItem {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
}

const MenuItemSchema = new Schema<IMenuItem>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
const MenuItem: Model<IMenuItem> =
    mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
