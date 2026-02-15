'use client';

import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

export default function ToastsContainer() {
    const { toasts, removeToast } = useToast();
    const [isHovered, setIsHovered] = useState(false);

    const getToastStyles = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    border: 'border-l-emerald-400',
                    accent: 'text-emerald-400',
                    bg: 'bg-emerald-400/5',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ),
                };
            case 'error':
                return {
                    border: 'border-l-red-400',
                    accent: 'text-red-400',
                    bg: 'bg-red-400/5',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ),
                };
            case 'warning':
                return {
                    border: 'border-l-amber-400',
                    accent: 'text-amber-400',
                    bg: 'bg-amber-400/5',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                };
            default: // info
                return {
                    border: 'border-l-blue-400',
                    accent: 'text-blue-400',
                    bg: 'bg-blue-400/5',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                };
        }
    };

    if (toasts.length === 0) return null;

    const totalToasts = toasts.length;
    const showStackIndicator = totalToasts > 1 && !isHovered;

    return (
        <div
            className="fixed bottom-4 left-4 z-50 max-w-sm w-full sm:max-w-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative">
                {toasts.map((toast, index) => {
                    const styles = getToastStyles(toast.type);
                    const isTopToast = index === totalToasts - 1;
                    const stackIndex = totalToasts - 1 - index;

                    const getTransform = () => {
                        if (isHovered) {
                            return `translateY(-${stackIndex * 80}px) scale(1)`;
                        } else {
                            if (isTopToast) {
                                return 'translateY(0) scale(1)';
                            } else {
                                const peekOffset = Math.min(stackIndex * 8, 24);
                                const scale = 1 - Math.min(stackIndex * 0.03, 0.09);
                                return `translateY(${peekOffset}px) scale(${scale})`;
                            }
                        }
                    };

                    const getOpacity = () => {
                        if (isHovered) return 1;
                        if (isTopToast) return 1;
                        return stackIndex <= 3 ? 0.6 : 0;
                    };

                    const getZIndex = () => {
                        return isHovered ? 50 + stackIndex : 50 - stackIndex;
                    };

                    return (
                        <div
                            key={toast.id}
                            className={`bg-dark-300/95 backdrop-blur-xl text-ivory rounded-xl shadow-dark-lg border border-dark-50/30 border-l-4 ${styles.border} ${styles.bg} p-4 absolute bottom-0 left-0 w-full`}
                            style={{
                                transform: getTransform(),
                                opacity: getOpacity(),
                                zIndex: getZIndex(),
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                pointerEvents: isHovered || isTopToast ? 'auto' : 'none',
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 mt-0.5 ${styles.accent}`}>{styles.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-relaxed text-ivory">{toast.message}</p>
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 p-1 hover:bg-dark-50/20 rounded-lg transition-colors duration-200 text-ivory-dim hover:text-ivory"
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

                {showStackIndicator && (
                    <div
                        className="absolute -top-3 -right-3 bg-accent text-dark-400 text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-glow-amber z-[100] animate-float"
                        style={{
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    >
                        {totalToasts}
                    </div>
                )}
            </div>
        </div>
    );
}
