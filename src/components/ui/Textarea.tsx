import React from 'react';
import { motion } from 'framer-motion';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
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
      <motion.textarea
        whileFocus={{ scale: 1.01 }}
        className={`
          block w-full rounded-lg border border-gray-300 dark:border-gray-600 
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
          px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
          transition-all duration-200 resize-none
          ${className}
        `}
        rows={4}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};