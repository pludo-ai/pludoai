import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Bot } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A] px-4 sm:px-6 lg:px-8 pt-16 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1A1A1A] dark:via-[#0A0A0A] dark:to-black border border-gray-300/50 dark:border-yellow-500/30 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-yellow-500/20 p-8 transition-all duration-300">
          {/* Animated 404 */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-8xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent mb-4"
          >
            404
          </motion.div>

          {/* Robot Icon */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 rounded-full flex items-center justify-center mx-auto">
              <Bot className="w-8 h-8 text-white dark:text-black" />
            </div>
          </motion.div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even our AI agents get lost sometimes!
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full bg-gradient-to-r from-gray-800 to-gray-700 dark:from-yellow-500 dark:to-yellow-400 hover:from-gray-700 hover:to-gray-600 dark:hover:from-yellow-400 dark:hover:to-yellow-300 text-white dark:text-black font-bold" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-full text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Fun Message */}
          <div className="mt-8 p-4 bg-gradient-to-r from-yellow-100 to-gray-100 dark:from-yellow-500/10 dark:to-gray-400/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Tip:</strong> While you're here, why not create an AI agent to help your visitors 
              navigate better? 
              <Link 
                to="/signup" 
                className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 ml-1"
              >
                Get started!
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};