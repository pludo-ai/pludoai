import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Moon, Sun, Menu, X, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-2xl border-b border-brand-gold/20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Premium Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative p-3 bg-gradient-to-r from-brand-gold to-brand-light-gold rounded-2xl shadow-lg shadow-brand-gold/30 group-hover:shadow-brand-gold/50"
            >
              <Crown className="w-8 h-8 text-black" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-light-gold rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-brand-gold via-brand-light-gold to-brand-gold bg-clip-text text-transparent tracking-wide">
                PLUDO.AI
              </span>
              <span className="text-xs text-brand-silver font-medium tracking-widest uppercase opacity-80">
                Premium AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className="text-gray-200 hover:text-brand-gold transition-colors duration-300 font-medium text-lg tracking-wide"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className="text-gray-200 hover:text-brand-gold transition-colors duration-300 font-medium text-lg tracking-wide"
                >
                  Create Agent
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-brand-gold transition-colors duration-300 font-medium text-lg tracking-wide"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-black font-bold px-8 py-3 rounded-xl shadow-lg shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all duration-300 transform hover:scale-105">
                    Begin Journey
                  </Button>
                </Link>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-3 text-gray-300 hover:text-brand-gold transition-colors duration-300 rounded-xl hover:bg-brand-gold/10"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-3 text-gray-300 hover:text-brand-gold transition-colors duration-300 rounded-xl hover:bg-brand-gold/10"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-gray-300 hover:text-brand-gold transition-colors duration-300 rounded-xl hover:bg-brand-gold/10"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-6 border-t border-brand-gold/20 bg-brand-dark/95 backdrop-blur-xl rounded-b-2xl"
          >
            {user ? (
              <div className="space-y-4">
                <Link
                  to="/dashboard"
                  className="block py-3 px-4 text-gray-200 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-300 rounded-xl font-medium text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className="block py-3 px-4 text-gray-200 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-300 rounded-xl font-medium text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Create Agent
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="block py-3 px-4 text-gray-200 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-300 rounded-xl font-medium text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block py-3"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-black font-bold py-3 rounded-xl shadow-lg">
                    Begin Journey
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Moon, Sun, Menu, X, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-2xl border-b border-brand-gold/20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Premium Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.7, ease: "circOut" }}
              className="relative p-3 bg-gradient-to-r from-brand-gold to-brand-light-gold rounded-2xl shadow-lg shadow-brand-gold/30 group-hover:shadow-brand-gold/50"
            >
              <Crown className="w-8 h-8 text-black" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-light-gold rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-brand-gold via-brand-light-gold to-brand-gold bg-clip-text text-transparent tracking-wide">
                PLUDO.AI
              </span>
              <span className="text-xs text-brand-silver font-medium tracking-widest uppercase opacity-80">
                AI Artisans
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className="text-gray-200 hover:text-brand-gold transition-colors duration-300 font-medium text-lg tracking-wide"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className="text-gray-200 hover:text-brand-gold transition-colors duration-300 font-medium text-lg tracking-wide"
                >
                  Create Agent
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-brand-gold transition-colors duration-300 font-medium text-lg tracking-wide"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-black font-bold px-8 py-3 rounded-xl shadow-lg shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all duration-300 transform hover:scale-105">
                    Begin Journey
                  </Button>
                </Link>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-3 text-gray-300 hover:text-brand-gold transition-colors duration-300 rounded-xl hover:bg-brand-gold/10"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-3 text-gray-300 hover:text-brand-gold transition-colors duration-300 rounded-xl hover:bg-brand-gold/10"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-gray-300 hover:text-brand-gold transition-colors duration-300 rounded-xl hover:bg-brand-gold/10"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-6 border-t border-brand-gold/20 bg-brand-dark/95 backdrop-blur-xl rounded-b-2xl"
          >
            {user ? (
              <div className="space-y-4 px-4">
                <Link
                  to="/dashboard"
                  className="block py-3 px-4 text-gray-200 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-300 rounded-xl font-medium text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className="block py-3 px-4 text-gray-200 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-300 rounded-xl font-medium text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Create Agent
                </Link>
              </div>
            ) : (
              <div className="space-y-4 px-4">
                <Link
                  to="/login"
                  className="block py-3 px-4 text-gray-200 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-300 rounded-xl font-medium text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block py-3"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-black font-bold py-3 rounded-xl shadow-lg">
                    Begin Journey
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};