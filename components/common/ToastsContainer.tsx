'use client';

import { useToast } from '@/context/ToastContext';

export default function ToastsContainer() {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-green-400',
          text: 'text-green-700',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
        };
      case 'error':
        return {
          bg: 'bg-white',
          border: 'border-red-400',
          text: 'text-red-700',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        };
      case 'warning':
        return {
          bg: 'bg-white',
          border: 'border-yellow-400',
          text: 'text-yellow-700',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      default: // info
        return {
          bg: 'bg-white',
          border: 'border-blue-400',
          text: 'text-blue-700',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full sm:max-w-md">
      {toasts.map((toast, index) => {
        const styles = getToastStyles(toast.type);
        return (
          <div
            key={toast.id}
            className={`${styles.bg} ${styles.text} rounded-xl shadow-2xl border-2 ${styles.border} p-4 transform transition-all duration-300 ease-out animate-slideInRight`}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}



