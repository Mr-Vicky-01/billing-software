'use client';

import { useState, useEffect } from 'react';
import { getQRCode, saveQRCode } from '@/lib/storage';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  total: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  total,
}: PaymentModalProps) {
  const [qrImage, setQRImage] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load QR code on mount
    const savedQR = getQRCode();
    if (savedQR) {
      setQRImage(savedQR);
    }
  }, [isOpen]);

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setQRImage(result);
        saveQRCode(result);
        setShowUpload(false);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQR = () => {
    setQRImage(null);
    saveQRCode('');
    setShowUpload(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Total Amount */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 mb-6 border border-blue-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Amount</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-dashed border-gray-300">
          {qrImage ? (
            <div className="flex flex-col items-center">
              <img
                src={qrImage}
                alt="Payment QR Code"
                className="w-48 h-48 object-contain mb-4 rounded-lg border-2 border-blue-200"
              />
              <p className="text-sm text-gray-600 text-center mb-4">
                Ask customer to scan this QR code to complete payment
              </p>
              <button
                onClick={handleRemoveQR}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove QR
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-gray-500 text-sm font-medium mb-3">No QR Code Uploaded</p>
              <button
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload QR Code
              </button>
            </div>
          )}
        </div>

        {/* Upload Input */}
        {showUpload && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select QR Code Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleQRUpload}
                disabled={loading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-500 bg-blue-50 transition-all cursor-pointer">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m10.39-4.39h-4m-12.78 0h-4M20.39 9.61l-2.83 2.83m-12.56 0l-2.83-2.83m12.56 12.56l2.83-2.83m-12.56 0l-2.83 2.83" />
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-blue-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG or GIF (max 5MB)</p>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowUpload(false)}
              className="mt-3 w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!qrImage}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 ${
              qrImage
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
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
