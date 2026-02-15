'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSettings, saveSettings } from '@/lib/api';

interface PaymentModalProps {
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PaymentModal({ total, onConfirm, onCancel }: PaymentModalProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedQR, setUploadedQR] = useState<string>('');

  useEffect(() => {
    loadQRCode();
  }, []);

  const loadQRCode = async () => {
    try {
      const settings = await getSettings();
      if (settings?.qrCode) {
        setQrCode(settings.qrCode);
      }
    } catch (error) {
      console.error('Failed to load QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setUploadedQR(result);
        try {
          await saveSettings({ qrCode: result });
          setQrCode(result);
        } catch (error) {
          console.error('Failed to save QR code:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQR = async () => {
    try {
      await saveSettings({ qrCode: '' });
      setQrCode('');
      setUploadedQR('');
    } catch (error) {
      console.error('Failed to remove QR code:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-dark-300 rounded-3xl shadow-dark-xl border border-dark-50/30 w-full max-w-md overflow-hidden animate-reveal-up">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-dark-50/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-ivory">Complete Payment</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-dark-50/20 rounded-lg transition-colors text-ivory-dim hover:text-ivory"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Total Amount */}
          <div className="dark-elevated rounded-2xl p-5 text-center">
            <p className="text-sm text-ivory-dim uppercase tracking-wider mb-1">Amount Due</p>
            <p className="text-4xl font-black text-accent">
              ₹{total.toFixed(2)}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ivory-muted uppercase tracking-wider">
              Scan QR to Pay
            </h3>

            {isLoading ? (
              <div className="h-48 bg-dark-200 rounded-xl animate-pulse flex items-center justify-center">
                <span className="text-ivory-dim text-sm">Loading...</span>
              </div>
            ) : qrCode ? (
              <div className="space-y-3">
                <div className="relative bg-white rounded-xl p-4 flex items-center justify-center mx-auto max-w-[250px]">
                  <Image
                    src={qrCode}
                    alt="Payment QR Code"
                    width={220}
                    height={220}
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={handleRemoveQR}
                  className="w-full text-center text-xs text-red-400/80 hover:text-red-400 transition-colors"
                >
                  Remove QR Code
                </button>
              </div>
            ) : (
              <label
                htmlFor="qr-upload-modal"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-dark-50/40 rounded-xl cursor-pointer bg-dark-200/50 hover:bg-dark-200 hover:border-accent/30 transition-all duration-200 group"
              >
                <div className="p-3 bg-dark-300 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm text-ivory-muted font-medium">Upload QR Code</p>
                <p className="text-xs text-ivory-dim mt-1">PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQRUpload}
                  className="hidden"
                  id="qr-upload-modal"
                />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onConfirm}
            className="w-full btn-accent py-3.5 rounded-xl text-base flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
