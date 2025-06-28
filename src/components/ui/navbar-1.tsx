"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, Crown, Diamond } from "lucide-react"
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
      <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-brand-dark/95 via-brand-dark-gray/95 to-brand-dark/95 backdrop-blur-xl rounded-full shadow-2xl shadow-brand-gold/20 w-full max-w-5xl relative z-10 border border-brand-gold/30 hover:border-brand-gold/50 transition-all duration-300">
        
        {/* Luxury Brand Logo */}
        <div className="flex items-center">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              {/* Luxury Logo with Gold/Silver Gradient */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-gold via-brand-light-gold to-brand-silver rounded-xl flex items-center justify-center shadow-lg shadow-brand-gold/30 border border-brand-gold/50">
                  <Crown className="w-6 h-6 text-brand-dark" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-silver rounded-full animate-pulse-slow" />
              </div>
              
              {/* Brand Name */}
              <div className="hidden sm:block">
                <span className="text-xl font-black bg-gradient-to-r from-brand-gold via-brand-light-gold to-brand-silver bg-clip-text text-transparent tracking-wider">
                  PLUDO.AI
                </span>
                <div className="w-full h-0.5 bg-gradient-to-r from-brand-gold to-brand-silver opacity-60" />
              </div>
            </Link>
          </motion.div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                to={item.href} 
                className="relative text-sm font-semibold text-gray-200 hover:text-brand-gold transition-all duration-300 tracking-wide group"
              >
                {item.label}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-gold to-brand-silver group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <motion.div
          className="hidden lg:flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 bg-gradient-to-r from-brand-gold/20 to-brand-silver/20 hover:from-brand-gold/30 hover:to-brand-silver/30 rounded-xl border border-brand-gold/30 hover:border-brand-gold/50 transition-all duration-300 shadow-lg shadow-brand-gold/10"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="w-5 h-5 text-brand-gold" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="w-5 h-5 text-brand-silver" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* CTA Button */}
          {user ? (
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-brand-dark font-bold px-6 py-3 rounded-xl shadow-lg shadow-brand-gold/30 border border-brand-gold/50"
                >
                  <Diamond className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </motion.div>
            </Link>
          ) : (
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-brand-dark font-bold px-6 py-3 rounded-xl shadow-lg shadow-brand-gold/30 border border-brand-gold/50"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Begin Journey
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="lg:hidden flex items-center p-2 bg-gradient-to-r from-brand-gold/20 to-brand-silver/20 rounded-xl border border-brand-gold/30" 
          onClick={toggleMenu} 
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="h-6 w-6 text-brand-gold" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-b from-brand-dark via-brand-dark-gray to-brand-dark backdrop-blur-xl z-50 pt-32 px-6 lg:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Luxury Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold via-transparent to-brand-silver animate-gradient bg-300%" />
            </div>

            {/* Close Button */}
            <motion.button
              className="absolute top-8 right-6 p-3 bg-gradient-to-r from-brand-gold/20 to-brand-silver/20 rounded-xl border border-brand-gold/30"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-brand-gold" />
            </motion.button>
            
            <div className="relative z-10 flex flex-col space-y-8">
              {/* Mobile Navigation */}
              {navigationItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 50 }}
                >
                  <Link 
                    to={item.href} 
                    className="block text-2xl font-bold text-white hover:text-brand-gold transition-all duration-300 py-4 border-b border-brand-gold/20 hover:border-brand-gold/50" 
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 30 }}
                className="pt-8 space-y-6"
              >
                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    toggleMenu();
                  }}
                  className="flex items-center justify-between w-full text-xl font-bold text-white hover:text-brand-gold transition-all duration-300 py-4 border-b border-brand-gold/20 hover:border-brand-gold/50"
                >
                  <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  <div className="p-2 bg-gradient-to-r from-brand-gold/20 to-brand-silver/20 rounded-lg">
                    {isDark ? (
                      <Sun className="w-6 h-6 text-brand-gold" />
                    ) : (
                      <Moon className="w-6 h-6 text-brand-silver" />
                    )}
                  </div>
                </button>
                
                {/* CTA Button */}
                {user ? (
                  <Link to="/dashboard" onClick={toggleMenu}>
                    <Button 
                      variant="primary" 
                      className="w-full bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-brand-dark font-black py-4 text-xl rounded-xl shadow-2xl shadow-brand-gold/40 border-2 border-brand-gold"
                    >
                      <Diamond className="w-6 h-6 mr-3" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup" onClick={toggleMenu}>
                    <Button 
                      variant="primary" 
                      className="w-full bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-brand-dark font-black py-4 text-xl rounded-xl shadow-2xl shadow-brand-gold/40 border-2 border-brand-gold"
                    >
                      <Crown className="w-6 h-6 mr-3" />
                      Begin Journey
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