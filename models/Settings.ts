import mongoose, { Schema, Model } from 'mongoose';

export interface ISettings {
    qrCode: string;
}

const SettingsSchema = new Schema<ISettings>(
    {
        qrCode: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
const Settings: Model<ISettings> =
    mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
