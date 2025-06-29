"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Crown, Diamond, Bot, Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";
import { Dialog, DialogContent } from "./dialog";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    const { isDark } = useThemeStore();
    
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2",
                        isDark 
                            ? "border-white/[0.15] shadow-[0_8px_32px_0_rgba(212,175,55,0.2)] after:bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.3),transparent_70%)]"
                            : "border-gray-800/[0.15] shadow-[0_8px_32px_0_rgba(55,65,81,0.2)] after:bg-[radial-gradient(circle_at_50%_50%,rgba(55,65,81,0.3),transparent_70%)]",
                        "after:absolute after:inset-0 after:rounded-full"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function GeometricNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useThemeStore();
    const { isDark, toggleTheme } = useThemeStore();

    const navigation = [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Demo', href: '#demo' },
        { name: 'About', href: '#about' },
    ];

    return (
        <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur-2xl border-b transition-colors duration-300 ${
            isDark 
                ? 'bg-[#0A0A0A]/90 border-yellow-500/20' 
                : 'bg-white/90 border-gray-300/20'
        }`}>
            <nav aria-label="Global" className="flex items-center justify-between p-4 lg:px-8 h-16">
                <div className="flex lg:flex-1">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="relative"
                        >
                            <img 
                                src="/pludo_svg_logo.svg" 
                                alt="PLUDO.AI Logo" 
                                className="w-10 h-10"
                            />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className={`text-lg font-black bg-gradient-to-r bg-clip-text text-transparent tracking-wide ${
                                isDark 
                                    ? 'from-yellow-400 via-yellow-500 to-yellow-400'
                                    : 'from-gray-800 via-gray-700 to-gray-800'
                            }`}>
                                PLUDO.AI
                            </span>
                            <span className={`text-xs font-medium tracking-widest uppercase opacity-80 hidden sm:block ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                AI Artisans
                            </span>
                        </div>
                    </Link>
                </div>
                
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 transition-colors ${
                            isDark 
                                ? 'text-gray-300 hover:text-yellow-400'
                                : 'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu aria-hidden="true" className="size-6" />
                    </button>
                </div>
                
                <div className="hidden lg:flex lg:gap-x-6">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className={`text-sm font-semibold transition-colors duration-300 ${
                            isDark 
                                ? 'text-gray-200 hover:text-yellow-400'
                                : 'text-gray-700 hover:text-gray-900'
                        }`}>
                            {item.name}
                        </a>
                    ))}
                </div>
                
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard" className={`text-sm font-semibold transition-colors duration-300 ${
                                isDark 
                                    ? 'text-gray-200 hover:text-yellow-400'
                                    : 'text-gray-700 hover:text-gray-900'
                            }`}>
                                Dashboard
                            </Link>
                            <Link to="/create" className={`text-sm font-semibold transition-colors duration-300 ${
                                isDark 
                                    ? 'text-gray-200 hover:text-yellow-400'
                                    : 'text-gray-700 hover:text-gray-900'
                            }`}>
                                Create Agent
                            </Link>
                        </div>
                    ) : (
                        <Link to="/login" className={`text-sm font-semibold transition-colors duration-300 ${
                            isDark 
                                ? 'text-gray-200 hover:text-yellow-400'
                                : 'text-gray-700 hover:text-gray-900'
                        }`}>
                            Sign In <span aria-hidden="true">&rarr;</span>
                        </Link>
                    )}
                    
                    <button
                        onClick={toggleTheme}
                        className={`p-2 transition-colors duration-300 rounded-lg ${
                            isDark 
                                ? 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </nav>
            
            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DialogContent className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto px-4 py-4 sm:max-w-sm border-l lg:hidden transition-colors duration-300 ${
                    isDark 
                        ? 'bg-[#0A0A0A] border-yellow-500/30'
                        : 'bg-white border-gray-300/30'
                }`}>
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2">
                            <img 
                                src="/pludo_svg_logo.svg" 
                                alt="PLUDO.AI Logo" 
                                className="h-8 w-auto"
                            />
                            <span className={`text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                                isDark 
                                    ? 'from-yellow-400 to-yellow-500'
                                    : 'from-gray-800 to-gray-700'
                            }`}>
                                PLUDO.AI
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`-m-2.5 rounded-md p-2.5 transition-colors ${
                                isDark 
                                    ? 'text-gray-300 hover:text-yellow-400'
                                    : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                            <span className="sr-only">Close menu</span>
                            <X aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className={`-my-6 divide-y ${
                            isDark ? 'divide-yellow-500/20' : 'divide-gray-300/20'
                        }`}>
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold transition-colors ${
                                            isDark 
                                                ? 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
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
                                                isDark 
                                                    ? 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/create"
                                            className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                                                isDark 
                                                    ? 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Create Agent
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                                            isDark 
                                                ? 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                )}
                                
                                <button
                                    onClick={() => {
                                        toggleTheme();
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`-mx-3 flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                                        isDark 
                                            ? 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                    <div className={`p-2 rounded-lg ${
                                        isDark 
                                            ? 'bg-gradient-to-r from-yellow-500/20 to-gray-400/20'
                                            : 'bg-gradient-to-r from-gray-800/20 to-gray-600/20'
                                    }`}>
                                        {isDark ? (
                                            <Sun className={`w-4 h-4 ${
                                                isDark ? 'text-yellow-400' : 'text-gray-800'
                                            }`} />
                                        ) : (
                                            <Moon className={`w-4 h-4 ${
                                                isDark ? 'text-gray-400' : 'text-gray-600'
                                            }`} />
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

export function HeroGeometric({
    badge = "The Pinnacle of AI Excellence",
    title1 = "Craft Extraordinary",
    title2 = "AI Agents",
    description = "Where artificial intelligence meets uncompromising luxury. Create, deploy, and scale sophisticated AI agents that redefine customer excellence.",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    description?: string;
}) {
    const { isDark } = useThemeStore();
    
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <>
            <GeometricNavbar />
            <div className={`relative h-screen w-full flex items-center justify-center overflow-hidden pt-16 transition-colors duration-300 ${
                isDark ? 'bg-[#0A0A0A]' : 'bg-white'
            }`}>
                {/* Luxury Background Gradients */}
                <div className={`absolute inset-0 blur-3xl ${
                    isDark 
                        ? 'bg-gradient-to-br from-yellow-500/[0.03] via-transparent to-gray-400/[0.03]' 
                        : 'bg-gradient-to-br from-gray-800/[0.03] via-transparent to-gray-600/[0.03]'
                }`} />

                {/* Floating Geometric Shapes - Responsive sizes */}
                <div className="absolute inset-0 overflow-hidden">
                    <ElegantShape
                        delay={0.3}
                        width={400}
                        height={100}
                        rotate={12}
                        gradient={isDark ? "from-yellow-500/[0.15]" : "from-gray-800/[0.15]"}
                        className="left-[-15%] md:left-[-10%] top-[15%] md:top-[20%]"
                    />

                    <ElegantShape
                        delay={0.5}
                        width={350}
                        height={80}
                        rotate={-15}
                        gradient={isDark ? "from-gray-400/[0.15]" : "from-gray-600/[0.15]"}
                        className="right-[-10%] md:right-[-5%] top-[65%] md:top-[70%]"
                    />

                    <ElegantShape
                        delay={0.4}
                        width={250}
                        height={60}
                        rotate={-8}
                        gradient={isDark ? "from-yellow-600/[0.15]" : "from-gray-700/[0.15]"}
                        className="left-[0%] md:left-[5%] bottom-[10%] md:bottom-[15%]"
                    />

                    <ElegantShape
                        delay={0.6}
                        width={150}
                        height={40}
                        rotate={20}
                        gradient={isDark ? "from-yellow-400/[0.15]" : "from-gray-900/[0.15]"}
                        className="right-[10%] md:right-[15%] top-[5%] md:top-[10%]"
                    />

                    <ElegantShape
                        delay={0.7}
                        width={120}
                        height={30}
                        rotate={-25}
                        gradient={isDark ? "from-gray-300/[0.15]" : "from-gray-500/[0.15]"}
                        className="left-[15%] md:left-[20%] top-[0%] md:top-[5%]"
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-6xl">
                    <div className="text-center">
                        <motion.div
                            custom={0}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-6 md:mb-8 border ${
                                isDark 
                                    ? 'bg-white/[0.03] border-yellow-500/[0.2]'
                                    : 'bg-gray-900/[0.03] border-gray-800/[0.2]'
                            }`}
                        >
                            <img 
                                src="/pludo_svg_logo.svg" 
                                alt="PLUDO.AI Logo" 
                                className="h-3 w-3"
                            />
                            <span className={`text-xs tracking-wide font-medium ${
                                isDark ? 'text-white/70' : 'text-gray-700'
                            }`}>
                                {badge}
                            </span>
                            <Diamond className={`h-3 w-3 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                        </motion.div>

                        <motion.div
                            custom={1}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 tracking-tighter leading-none">
                                <span className={`bg-clip-text text-transparent ${
                                    isDark 
                                        ? 'bg-gradient-to-b from-white to-white/80'
                                        : 'bg-gradient-to-b from-gray-900 to-gray-700'
                                }`}>
                                    {title1}
                                </span>
                                <br />
                                <span
                                    className={cn(
                                        "bg-clip-text text-transparent",
                                        isDark 
                                            ? "bg-gradient-to-r from-yellow-400 via-white/90 to-gray-300"
                                            : "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-700"
                                    )}
                                >
                                    {title2}
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            custom={2}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <p className={`text-base sm:text-lg md:text-xl mb-8 md:mb-10 leading-relaxed font-light tracking-wide max-w-3xl mx-auto px-4 ${
                                isDark ? 'text-white/50' : 'text-gray-600'
                            }`}>
                                {description}
                            </p>
                        </motion.div>

                        {/* CTA Buttons - Responsive */}
                        <motion.div
                            custom={3}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 md:mb-16"
                        >
                            <motion.a
                                href="/signup"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`inline-flex items-center justify-center px-8 py-4 text-lg font-black rounded-xl shadow-2xl transition-all duration-300 border-2 w-full sm:w-auto ${
                                    isDark 
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black shadow-yellow-500/30 hover:shadow-yellow-500/50 border-yellow-500/50'
                                        : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-gray-800/30 hover:shadow-gray-800/50 border-gray-800/50'
                                }`}
                            >
                                <img 
                                    src="/pludo_svg_logo.svg" 
                                    alt="PLUDO.AI Logo" 
                                    className="w-5 h-5 mr-2"
                                />
                                Begin Your Journey
                            </motion.a>
                            
                            <motion.a
                                href="#demo"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`inline-flex items-center text-lg font-semibold transition-colors duration-300 ${
                                    isDark 
                                        ? 'text-white/80 hover:text-yellow-400'
                                        : 'text-gray-700 hover:text-gray-900'
                                }`}
                            >
                                Experience Excellence
                                <span className="ml-2 text-xl">→</span>
                            </motion.a>
                        </motion.div>

                        {/* Stats - Responsive Grid */}
                        <motion.div
                            custom={4}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto"
                        >
                            {[
                                { number: "100K+", label: "Elite Agents" },
                                { number: "99.99%", label: "Uptime" },
                                { number: "5M+", label: "Interactions" },
                                { number: "195", label: "Countries" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className={`text-2xl md:text-3xl font-black mb-1 group-hover:scale-110 transition-transform duration-300 ${
                                        isDark ? 'text-yellow-400' : 'text-gray-800'
                                    }`}>
                                        {stat.number}
                                    </div>
                                    <div className={`text-xs md:text-sm font-medium tracking-wide uppercase ${
                                        isDark ? 'text-white/40' : 'text-gray-600'
                                    }`}>
                                        {stat.label}
                                    </div>
                                    <div className={`w-full h-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                        isDark 
                                            ? 'bg-gradient-to-r from-transparent via-yellow-500 to-transparent'
                                            : 'bg-gradient-to-r from-transparent via-gray-800 to-transparent'
                                    }`} />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2"
                >
                    <span className={`text-xs uppercase tracking-widest font-medium ${
                        isDark ? 'text-yellow-400/60' : 'text-gray-600'
                    }`}>Discover Excellence</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className={`w-5 h-8 border-2 rounded-full flex justify-center ${
                            isDark ? 'border-yellow-500/40' : 'border-gray-800/40'
                        }`}
                    >
                        <div className={`w-1 h-2 rounded-full mt-1 ${
                            isDark ? 'bg-yellow-500' : 'bg-gray-800'
                        }`} />
                    </motion.div>
                </motion.div>

                {/* Gradient Overlays */}
                <div className={`absolute inset-0 pointer-events-none ${
                    isDark 
                        ? 'bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/80'
                        : 'bg-gradient-to-t from-white via-transparent to-white/80'
                }`} />
            </div>
        </>
    );
}