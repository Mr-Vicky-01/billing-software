'use client';

import { useState, useEffect } from 'react';
import { getQRCode, saveQRCode } from '@/lib/storage';
import { useToast } from '@/context/ToastContext';

export default function QRCodeSettings() {
  const { showToast } = useToast();
  const [qrImage, setQRImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedQR = getQRCode();
    if (savedQR) {
      setQRImage(savedQR);
    }
  }, []);

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
      }

      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setQRImage(result);
        saveQRCode(result);
        showToast('QR Code updated successfully!', 'success');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQR = () => {
    if (confirm('Are you sure you want to remove the QR code?')) {
      setQRImage(null);
      saveQRCode('');
      showToast('QR Code removed', 'info');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-100 p-6 sm:p-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Payment QR Code
      </h3>

      {/* Current QR Code Display */}
      {qrImage && (
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Current QR Code</h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={qrImage}
              alt="Payment QR Code"
              className="w-40 h-40 object-contain rounded-lg border-2 border-blue-200 bg-gray-50 p-4"
            />
            <div className="flex-1">
              <p className="text-gray-600 mb-4">
                This QR code will be displayed to customers when they click "Pay Now"
              </p>
              <button
                onClick={handleRemoveQR}
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          {qrImage ? 'Update QR Code' : 'Upload QR Code'}
        </h4>
        <label className="block">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-blue-50">
            <input
              type="file"
              accept="image/*"
              onChange={handleQRUpload}
              disabled={loading}
              className="hidden"
            />
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m10.39-4.39h-4m-12.78 0h-4M20.39 9.61l-2.83 2.83m-12.56 0l-2.83-2.83m12.56 12.56l2.83-2.83m-12.56 0l-2.83 2.83" />
                </svg>
                <span className="text-blue-600 font-medium">Uploading...</span>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-blue-600 font-semibold mb-1">Click to upload QR code</p>
                <p className="text-gray-500 text-sm">or drag and drop</p>
                <p className="text-gray-400 text-xs mt-2">PNG, JPG or GIF (max 5MB)</p>
              </>
            )}
          </div>
        </label>
        <p className="text-xs text-gray-500 mt-3">
          💡 Tip: You can update the QR code anytime. The new code will be used for all future payments.
        </p>
      </div>
    </div>
  );
}
