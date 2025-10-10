import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export const BaseModal = ({
    isOpen,
    onClose,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEsc = true,
    className = 'bg-white',
    title = null,
}) => {
    // Close on ESC key
    useEffect(() => {
        if (!closeOnEsc || !isOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEsc, isOpen, onClose]);
    // Don't render if not open
    if (!isOpen) return null;

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    // Size classes
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
        full: 'max-w-7xl',
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div
                className={` rounded-xl shadow-2xl w-full max-h-[96vh] overflow-hidden flex flex-col ${sizeClasses[size]} ${className}`}
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                {/* Optional Header with Title */}
                {title && (
                    <div className="bg-gradient-to-br from-dark to-gray-800  px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                                aria-label="Close modal"
                            >
                                <FiX size={24} />
                            </button>
                        )}
                    </div>
                )}

                {/* Close button (when no title) */}
                {!title && showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors z-10"
                        aria-label="Close modal"
                    >
                        <FiX size={24} />
                    </button>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
