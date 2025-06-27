import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Bot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center"
      >
        <Card className="p-8">
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
            className="text-8xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4"
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
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even our AI agents get lost sometimes!
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-full text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Fun Message */}
          <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              💡 <strong>Tip:</strong> While you're here, why not create an AI agent to help your visitors 
              navigate better? 
              <Link 
                to="/signup" 
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 ml-1"
              >
                Get started!
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};