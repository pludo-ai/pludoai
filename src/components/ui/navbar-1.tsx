"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { useThemeStore } from "../../store/themeStore"
import { Button } from "./Button"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()

  const toggleMenu = () => setIsOpen(!isOpen)

  const navigationItems = user 
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Create Agent", href: "/create" },
        { label: "Docs", href: "/docs" }
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Pricing", href: "/pricing" },
        { label: "Docs", href: "/docs" },
        { label: "About", href: "/about" }
      ]

  return (
    <div className="flex justify-center w-full py-6 px-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full shadow-lg w-full max-w-4xl relative z-10 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center">
          <motion.div
            className="w-8 h-8 mr-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          </motion.div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                to={item.href} 
                className="text-sm text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="md:hidden flex items-center" 
          onClick={toggleMenu} 
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="h-6 w-6 text-gray-900 dark:text-gray-100" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            </motion.button>
            
            <div className="flex flex-col space-y-6">
              {navigationItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link 
                    to={item.href} 
                    className="text-base text-gray-900 dark:text-gray-100 font-medium" 
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6 space-y-4"
              >
                <button
                  onClick={toggleTheme}
                  className="w-full text-left text-base text-gray-900 dark:text-gray-100 font-medium"
                >
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                
                {user ? (
                  <Link to="/dashboard" onClick={toggleMenu}>
                    <Button variant="primary" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup" onClick={toggleMenu}>
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }