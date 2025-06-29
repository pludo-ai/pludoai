"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Crown, Diamond, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

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
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
            {/* Luxury Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.03] via-transparent to-gray-400/[0.03] blur-3xl" />

            {/* Floating Geometric Shapes with Gold/Silver Theme */}
            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-yellow-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-gray-400/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-yellow-600/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-yellow-400/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-gray-300/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />

                <ElegantShape
                    delay={0.8}
                    width={180}
                    height={50}
                    rotate={18}
                    gradient="from-yellow-300/[0.12]"
                    className="right-[8%] md:right-[12%] bottom-[20%] md:bottom-[25%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-yellow-500/[0.2] mb-8 md:mb-12 backdrop-blur-sm"
                    >
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-white/70 tracking-wide font-medium">
                            {badge}
                        </span>
                        <Diamond className="h-4 w-4 text-gray-400" />
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-6 md:mb-8 tracking-tighter leading-none">
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
                        <p className="text-lg sm:text-xl md:text-2xl text-white/50 mb-12 leading-relaxed font-light tracking-wide max-w-4xl mx-auto px-4">
                            {description}
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8"
                    >
                        <motion.a
                            href="/signup"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center px-12 py-6 text-xl font-black bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black rounded-2xl shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 border-2 border-yellow-500/50"
                        >
                            <Crown className="w-6 h-6 mr-3" />
                            Begin Your Journey
                        </motion.a>
                        
                        <motion.a
                            href="#demo"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center text-xl font-semibold text-white/80 hover:text-yellow-400 transition-colors duration-300"
                        >
                            Experience Excellence
                            <span className="ml-3 text-2xl">→</span>
                        </motion.a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        custom={4}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
                    >
                        {[
                            { number: "100K+", label: "Elite Agents Deployed" },
                            { number: "99.99%", label: "Guaranteed Uptime" },
                            { number: "5M+", label: "Daily Interactions" },
                            { number: "195", label: "Countries Served" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {stat.number}
                                </div>
                                <div className="text-white/40 text-sm font-medium tracking-wide uppercase">
                                    {stat.label}
                                </div>
                                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2"
            >
                <span className="text-yellow-400/60 text-xs uppercase tracking-widest font-medium">Discover Excellence</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-6 h-10 border-2 border-yellow-500/40 rounded-full flex justify-center"
                >
                    <div className="w-1 h-3 bg-yellow-500 rounded-full mt-2" />
                </motion.div>
            </motion.div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/80 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }