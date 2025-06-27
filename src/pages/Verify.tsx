import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Bot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Verify: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                PLUDO.AI
              </span>
            </div>
            
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
            </p>
          </div>

          {/* Email Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What's next?
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 text-left">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the verification link</li>
                <li>• Return here to sign in</li>
                <li>• Start building your AI agent!</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link to="/login" className="block">
              <Button className="w-full" size="lg">
                Continue to Sign In
              </Button>
            </Link>
            
            <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Didn't receive the email? Resend verification
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Having trouble? Contact our support team for assistance.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};