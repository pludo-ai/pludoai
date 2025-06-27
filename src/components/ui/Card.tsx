import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
        border border-gray-200/50 dark:border-gray-700/50
        rounded-2xl shadow-xl
        ${hover ? 'hover:shadow-2xl hover:border-primary-500/30' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};