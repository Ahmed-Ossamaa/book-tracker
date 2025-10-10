/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "red", 
    icon: Icon = FiAlertTriangle
}) => {
    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    const colorClasses = {
        red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    };

    const iconColorClasses = {
        red: 'text-red-600 bg-red-100',
        blue: 'text-blue-600 bg-blue-100',
        green: 'text-green-600 bg-green-100'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FiX size={20} />
                </button>

                {/* Content */}
                <div className="p-6">
                    {/* Icon */}
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconColorClasses[confirmColor]} mb-4`}>
                        <Icon size={24} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-600 text-center mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorClasses[confirmColor]}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};