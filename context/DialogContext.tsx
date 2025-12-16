'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
}

interface DialogContextType {
    showDialog: (options: DialogOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}

interface DialogState extends DialogOptions {
    isOpen: boolean;
    resolve?: (value: boolean) => void;
}

export function DialogProvider({ children }: { children: ReactNode }) {
    const [dialogState, setDialogState] = useState<DialogState>({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'OK',
        cancelText: 'Cancel',
        type: 'info',
    });

    const showDialog = useCallback((options: DialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText || 'OK',
                cancelText: options.cancelText || 'Cancel',
                type: options.type || 'info',
                resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        dialogState.resolve?.(true);
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    }, [dialogState]);

    const handleCancel = useCallback(() => {
        dialogState.resolve?.(false);
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    }, [dialogState]);

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {children}
            {dialogState.isOpen && (
                <ConfirmDialog
                    title={dialogState.title}
                    message={dialogState.message}
                    confirmText={dialogState.confirmText!}
                    cancelText={dialogState.cancelText!}
                    type={dialogState.type!}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </DialogContext.Provider>
    );
}

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmDialog({
    title,
    message,
    confirmText,
    cancelText,
    type,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    confirmBg: 'bg-red-600 hover:bg-red-700',
                    iconBg: 'bg-red-100',
                };
            case 'warning':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    confirmBg: 'bg-orange-600 hover:bg-orange-700',
                    iconBg: 'bg-yellow-100',
                };
            case 'success':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ),
                    confirmBg: 'bg-green-600 hover:bg-green-700',
                    iconBg: 'bg-green-100',
                };
            default: // info
                return {
                    icon: (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    confirmBg: 'bg-blue-600 hover:bg-blue-700',
                    iconBg: 'bg-blue-100',
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slideUp overflow-visible">
                {/* Icon */}
                <div className={`${styles.iconBg} rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                    {styles.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

                {/* Message */}
                <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>


                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-end mt-2">
                    <button
                        onClick={onCancel}
                        className="flex-shrink-0 px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-shrink-0 px-6 py-2.5 rounded-lg border-2 border-orange-600 text-orange-600 font-semibold hover:bg-orange-50 transition-colors duration-200"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
