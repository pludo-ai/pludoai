"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Crown, Diamond, Bot, Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";
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
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(212,175,55,0.2)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.3),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function GeometricNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();

    const navigation = [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Demo', href: '#demo' },
        { name: 'About', href: '#about' },
    ];

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-yellow-500/20">
            <nav aria-label="Global" className="flex items-center justify-between p-4 lg:px-8 h-16">
                <div className="flex lg:flex-1">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative p-2 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition-all duration-300">
                            <Crown className="w-6 h-6 text-black" />
                        </div>
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
                            <Link to="/dashboard" className="text-sm font-semibold text-gray-200 hover:text-yellow-400 transition-colors duration-300">
                                Dashboard
                            </Link>
                            <Link to="/create" className="text-sm font-semibold text-gray-200 hover:text-yellow-400 transition-colors duration-300">
                                Create Agent
                            </Link>
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-gray-200 hover:text-yellow-400 transition-colors duration-300">
                            Sign In <span aria-hidden="true">&rarr;</span>
                        </Link>
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
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/create"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Create Agent
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
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

function HeroGeometric({
    badge = "AI Excellence",
    title1 = "Craft Extraordinary",
    title2 = "AI Agents",
    description = "Where artificial intelligence meets uncompromising luxury. Create, deploy, and scale sophisticated AI agents that redefine customer excellence.",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    description?: string;
}) {
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
            <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A] pt-16">
                {/* Luxury Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.03] via-transparent to-gray-400/[0.03] blur-3xl" />

                {/* Floating Geometric Shapes - Responsive sizes */}
                <div className="absolute inset-0 overflow-hidden">
                    <ElegantShape
                        delay={0.3}
                        width={400}
                        height={100}
                        rotate={12}
                        gradient="from-yellow-500/[0.15]"
                        className="left-[-15%] md:left-[-10%] top-[15%] md:top-[20%]"
                    />

                    <ElegantShape
                        delay={0.5}
                        width={350}
                        height={80}
                        rotate={-15}
                        gradient="from-gray-400/[0.15]"
                        className="right-[-10%] md:right-[-5%] top-[65%] md:top-[70%]"
                    />

                    <ElegantShape
                        delay={0.4}
                        width={250}
                        height={60}
                        rotate={-8}
                        gradient="from-yellow-600/[0.15]"
                        className="left-[0%] md:left-[5%] bottom-[10%] md:bottom-[15%]"
                    />

                    <ElegantShape
                        delay={0.6}
                        width={150}
                        height={40}
                        rotate={20}
                        gradient="from-yellow-400/[0.15]"
                        className="right-[10%] md:right-[15%] top-[5%] md:top-[10%]"
                    />

                    <ElegantShape
                        delay={0.7}
                        width={120}
                        height={30}
                        rotate={-25}
                        gradient="from-gray-300/[0.15]"
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
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-yellow-500/[0.2] mb-6 md:mb-8 backdrop-blur-sm"
                        >
                            <Crown className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-white/70 tracking-wide font-medium">
                                {badge}
                            </span>
                            <Diamond className="h-3 w-3 text-gray-400" />
                        </motion.div>

                        <motion.div
                            custom={1}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 tracking-tighter leading-none">
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                    {title1}
                                </span>
                                <br />
                                <span
                                    className={cn(
                                        "bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-white/90 to-gray-300"
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
                            <p className="text-base sm:text-lg md:text-xl text-white/50 mb-8 md:mb-10 leading-relaxed font-light tracking-wide max-w-3xl mx-auto px-4">
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
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-black bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black rounded-xl shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 border-2 border-yellow-500/50 w-full sm:w-auto"
                            >
                                <Crown className="w-5 h-5 mr-2" />
                                Begin Your Journey
                            </motion.a>
                            
                            <motion.a
                                href="#demo"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center text-lg font-semibold text-white/80 hover:text-yellow-400 transition-colors duration-300"
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
                                    <div className="text-2xl md:text-3xl font-black text-yellow-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                                        {stat.number}
                                    </div>
                                    <div className="text-white/40 text-xs md:text-sm font-medium tracking-wide uppercase">
                                        {stat.label}
                                    </div>
                                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    <span className="text-yellow-400/60 text-xs uppercase tracking-widest font-medium">Discover Excellence</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-5 h-8 border-2 border-yellow-500/40 rounded-full flex justify-center"
                    >
                        <div className="w-1 h-2 bg-yellow-500 rounded-full mt-1" />
                    </motion.div>
                </motion.div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/80 pointer-events-none" />
            </div>
        </>
    );
}

export { HeroGeometric }