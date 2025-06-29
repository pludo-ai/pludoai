import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-yellow-600 to-yellow-700 dark:from-yellow-500 dark:to-yellow-600 hover:from-yellow-700 hover:to-yellow-800 dark:hover:from-yellow-600 dark:hover:to-yellow-700 text-white dark:text-black shadow-lg hover:shadow-xl focus:ring-yellow-500',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-400 dark:to-gray-500 hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-500 dark:hover:to-gray-600 text-white dark:text-black shadow-lg hover:shadow-xl focus:ring-gray-500',
    outline: 'border-2 border-yellow-600 dark:border-yellow-500 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-500 hover:text-white dark:hover:text-black focus:ring-yellow-500',
    ghost: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
};