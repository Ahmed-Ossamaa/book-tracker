export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50';
    const variants = {
        primary: 'bg-primary text-white hover:bg-red-600',
        secondary: 'bg-secondary text-white hover:bg-blue-900',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        danger: 'bg-red-500 text-white hover:bg-red-600'
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};
