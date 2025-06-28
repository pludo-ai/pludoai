import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Moon, Sun, Menu, X, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative"
            >
              <div className="p-3 bg-gradient-to-r from-brand-gold to-yellow-400 rounded-2xl shadow-lg shadow-brand-gold/30">
                <Bot className="w-8 h-8 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold rounded-full animate-pulse" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-brand-gold to-white bg-clip-text text-transparent group-hover:from-white group-hover:to-brand-gold transition-all duration-300">
                PLUDO.AI
              </span>
              <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                AI Agent Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/features"
                className="text-gray-300 hover:text-brand-gold transition-colors font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/pricing"
                className="text-gray-300 hover:text-brand-gold transition-colors font-medium relative group"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/docs"
                className="text-gray-300 hover:text-brand-gold transition-colors font-medium relative group"
              >
                Docs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-brand-gold transition-colors font-medium flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                </Link>
                <Link to="/create">
                  <Button className="bg-brand-gold hover:bg-brand-light-gold text-black font-bold px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-gold/30">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Agent
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-brand-gold to-yellow-400 hover:from-yellow-400 hover:to-brand-gold text-black font-bold px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-gold/30">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 text-gray-400 hover:text-brand-gold transition-colors rounded-xl hover:bg-brand-gold/10"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-brand-gold transition-colors rounded-lg"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-brand-gold transition-colors rounded-lg"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-6 border-t border-brand-gold/20 bg-black/95 backdrop-blur-xl"
          >
            <div className="space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/features"
                  className="block py-3 px-4 text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-200 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="block py-3 px-4 text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-200 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/docs"
                  className="block py-3 px-4 text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-200 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Documentation
                </Link>
              </div>

              {/* User Actions */}
              {user ? (
                <div className="space-y-2 pt-4 border-t border-brand-gold/20">
                  <Link
                    to="/dashboard"
                    className="block py-3 px-4 text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-200 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create"
                    className="block py-3 px-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full bg-brand-gold hover:bg-brand-light-gold text-black font-bold py-3 rounded-xl">
                      <Zap className="w-4 h-4 mr-2" />
                      Create Agent
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t border-brand-gold/20">
                  <Link
                    to="/login"
                    className="block py-3 px-4 text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-200 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-3 px-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-brand-gold to-yellow-400 text-black font-bold py-3 rounded-xl">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};