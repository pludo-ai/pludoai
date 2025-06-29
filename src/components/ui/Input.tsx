import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          className={`
            block w-full rounded-lg border 
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
            px-3 py-2 ${icon ? 'pl-10' : ''} 
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            border-gray-300 dark:border-gray-600
            focus:border-yellow-500 dark:focus:border-yellow-500 
            focus:ring-2 focus:ring-yellow-500/20 dark:focus:ring-yellow-500/20 
            focus:outline-none
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};