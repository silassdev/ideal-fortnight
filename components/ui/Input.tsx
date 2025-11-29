import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        block w-full px-3 py-2 
                        border rounded-md shadow-sm 
                        text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        disabled:bg-gray-50 disabled:text-gray-500
                        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
