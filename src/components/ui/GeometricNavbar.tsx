"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown, Diamond, Menu, X, Sun, Moon } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { Dialog, DialogContent } from "./dialog";
import { motion } from "framer-motion";

export function GeometricNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const location = useLocation();

    const navigation = [
        { name: 'Features', href: '/#features' },
        { name: 'Pricing', href: '/#pricing' },
        { name: 'Demo', href: '/#demo' },
        { name: 'About', href: '/#about' },
    ];

    // Don't show navigation on landing page since it has its own integrated nav
    if (location.pathname === '/') {
        return null;
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-yellow-500/20">
            <nav aria-label="Global" className="flex items-center justify-between p-4 lg:px-8 h-16">
                <div className="flex lg:flex-1">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="relative p-2 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50"
                        >
                            <Crown className="w-6 h-6 text-black" />
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent tracking-wide">
                                PLUDO.AI
                            </span>
                            <span className="text-xs text-gray-400 font-medium tracking-widest uppercase opacity-80 hidden sm:block">
                                AI Artisans
                            </span>
                        </div>
                    </Link>
                </div>
                
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu aria-hidden="true" className="size-6" />
                    </button>
                </div>
                
                <div className="hidden lg:flex lg:gap-x-6">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm font-semibold text-gray-200 hover:text-yellow-400 transition-colors duration-300">
                            {item.name}
                        </a>
                    ))}
                </div>
                
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/dashboard" 
                                className={`text-sm font-semibold transition-colors duration-300 ${
                                    location.pathname === '/dashboard' 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-200 hover:text-yellow-400'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/create" 
                                className={`text-sm font-semibold transition-colors duration-300 ${
                                    location.pathname === '/create' 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-200 hover:text-yellow-400'
                                }`}
                            >
                                Create Agent
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/login" 
                                className={`text-sm font-semibold transition-colors duration-300 ${
                                    location.pathname === '/login' 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-200 hover:text-yellow-400'
                                }`}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup"
                                className="inline-flex items-center px-4 py-2 text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black rounded-lg shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
                            >
                                Begin Journey
                            </Link>
                        </div>
                    )}
                    
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 rounded-lg hover:bg-yellow-500/10"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </nav>
            
            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DialogContent className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#0A0A0A] px-4 py-4 sm:max-w-sm border-l border-yellow-500/30 lg:hidden">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="p-2 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl">
                                <Crown className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                PLUDO.AI
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-yellow-400 transition-colors"
                        >
                            <span className="sr-only">Close menu</span>
                            <X aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-yellow-500/20">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6 space-y-2">
                                {user ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                                                location.pathname === '/dashboard'
                                                    ? 'text-yellow-400 bg-yellow-500/10'
                                                    : 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400'
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/create"
                                            className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                                                location.pathname === '/create'
                                                    ? 'text-yellow-400 bg-yellow-500/10'
                                                    : 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400'
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Create Agent
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                                                location.pathname === '/login'
                                                    ? 'text-yellow-400 bg-yellow-500/10'
                                                    : 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400'
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="block py-3"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <div className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-bold py-3 rounded-xl shadow-lg text-center">
                                                Begin Journey
                                            </div>
                                        </Link>
                                    </>
                                )}
                                
                                <button
                                    onClick={() => {
                                        toggleTheme();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="-mx-3 flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-base font-semibold text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
                                >
                                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                    <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-gray-400/20 rounded-lg">
                                        {isDark ? (
                                            <Sun className="w-4 h-4 text-yellow-400" />
                                        ) : (
                                            <Moon className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </header>
    );
}