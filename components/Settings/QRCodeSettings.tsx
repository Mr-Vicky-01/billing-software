'use client';

import { useState } from 'react';
import Image from 'next/image';
import { saveSettings } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface QRCodeSettingsProps {
  initialSettings: { qrCode?: string } | null;
}

export default function QRCodeSettings({ initialSettings }: QRCodeSettingsProps) {
  const { showToast } = useToast();
  const [qrCode, setQrCode] = useState<string>(initialSettings?.qrCode || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        await saveSettings({ qrCode: result });
        setQrCode(result);
        showToast('QR code uploaded successfully!', 'success');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showToast('Failed to upload QR code', 'error');
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await saveSettings({ qrCode: '' });
      setQrCode('');
      showToast('QR code removed', 'success');
    } catch (error) {
      showToast('Failed to remove QR code', 'error');
    }
  };

  return (
    <div className="dark-card-static rounded-3xl p-6 sm:p-8 shadow-dark-lg">
      <h2 className="text-xl font-bold text-ivory mb-2 flex items-center gap-3">
        <span className="w-1 h-6 bg-accent rounded-full" />
        Payment QR Code
      </h2>
      <p className="text-ivory-muted text-sm mb-8 ml-4">Upload your payment QR code to display during checkout</p>

      {qrCode ? (
        <div className="space-y-6">
          {/* QR Preview */}
          <div className="bg-white rounded-2xl p-6 flex items-center justify-center mx-auto max-w-[300px] shadow-dark">
            <Image
              src={qrCode}
              alt="Payment QR Code"
              width={250}
              height={250}
              className="object-contain"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 max-w-[300px] mx-auto">
            <label
              htmlFor="qr-update"
              className="flex-1 btn-dark py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Replace
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="qr-update"
                disabled={isUploading}
              />
            </label>
            <button
              onClick={handleRemove}
              className="flex-1 btn-danger py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="qr-upload"
          className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-accent/25 rounded-2xl cursor-pointer bg-dark-300/50 hover:bg-dark-200/50 hover:border-accent/40 transition-all duration-300 group"
        >
          <div className="p-4 bg-dark-200 rounded-2xl shadow-dark mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-ivory mb-1">
            {isUploading ? 'Uploading...' : 'Click to upload QR Code'}
          </p>
          <p className="text-xs text-ivory-dim">PNG, JPG, or GIF up to 5MB</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="qr-upload"
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
