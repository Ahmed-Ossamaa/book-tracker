// components/common/Input.jsx
export const Input = ({ label, type = "text", value, onChange, placeholder, className = "", ...props }) => {
    return (
        <div className="flex flex-col gap-1 my-2 w-full my-4">
            {label && (
                <label className="text-sm font-medium text-gray-700 px-2">{label}</label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`px-4 py-2 rounded-lg border border-gray-300 
                            focus:outline-none focus:ring-2 
                            focus:border-secondary 
                            text-gray-900 placeholder-gray-400 
                            ${className}`}
                {...props}
            />
        </div>
    );
};



