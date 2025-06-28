import React, { useRef, useEffect, Suspense, FC, ReactNode } from 'react';

// --- DEPENDENCY NOTES ---
// To avoid build errors in sandboxed environments, this component assumes external libraries
// are loaded globally (e.g., via <script> tags in your main HTML file).
//
// Required libraries for full functionality:
// - React & ReactDOM
// - GSAP (Core, ScrollTrigger, TextPlugin)
// - Three.js & React-Three-Fiber (@react-three/fiber)
// - Lucide-React (for icons)
//
// The following imports are commented out but show what's needed.
//
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { TextPlugin } from 'gsap/TextPlugin';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { Link } from 'react-router-dom';
import {
  Bot, Globe, Shield, ArrowRight, Check, Star, Sparkles, Palette, Brain, Rocket, Target
} from 'lucide-react';


// --- SELF-CONTAINED UI COMPONENTS ---
// To resolve dependency errors, Button and Card components are defined internally.

const Button: FC<{ children: ReactNode; className?: string; href?: string; }> = ({ children, className, href }) => (
  <a href={href} className={`inline-flex items-center justify-center ${className}`}>
    {children}
  </a>
);

const Card: FC<{ children: ReactNode; className?: string; }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);


// --- 3D HERO BACKGROUND ---
// This component creates the interactive 3D particle background.

const MagicParticles: FC = () => {
    // @ts-ignore - Assuming 'useThree' is available from @react-three/fiber
    const { viewport, mouse } = useThree();
    const meshRef = useRef<THREE.Points>();

    const numParticles = 5000;
    const particles = React.useMemo(() => {
        const temp = [];
        for (let i = 0; i < numParticles; i++) {
            const time = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = Math.random() * 2 - 1;
            const y = Math.random() * 2 - 1;
            const z = Math.random() * 2 - 1;
            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, []);

    const dummy = new THREE.Object3D();
    // @ts-ignore - Assuming 'useFrame' is available
    useFrame(() => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            let { factor, speed } = particle;
            const t = (particle.time += speed);
            dummy.position.set(
                particle.x * factor + Math.cos(t / 10) * factor,
                particle.y * factor + Math.sin(t / 10) * factor,
                particle.z * factor + Math.sin(t / 10) * factor
            );
            dummy.updateMatrix();
            // @ts-ignore
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        // @ts-ignore
        meshRef.current.instanceMatrix.needsUpdate = true;
        
        // Make the particle cloud follow the mouse
        gsap.to(meshRef.current.rotation, {
            y: mouse.x * 0.1,
            x: mouse.y * 0.1,
            duration: 1,
            ease: 'power3.out'
        });
    });

    return (
        // @ts-ignore
        <instancedMesh ref={meshRef} args={[null, null, numParticles]}>
            <sphereGeometry args={[0.02, 32, 32]} />
            <meshStandardMaterial color="#FFD700" roughness={0.5} metalness={0.5} />
        </instancedMesh>
    );
};

const Scene3D: FC = () => {
    // Gracefully fail if R3F/Three is not available.
    // @ts-ignore
    if (typeof Canvas === 'undefined') return null;

    return (
        // @ts-ignore
        <Canvas camera={{ fov: 75, position: [0, 0, 20] }} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#FFD700" />
            <Suspense fallback={null}>
                <MagicParticles />
            </Suspense>
        </Canvas>
    );
};


// --- PAGE SECTIONS (as sub-components) ---

const HeroSection: FC = () => (
    <section className="relative min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm z-10" />
        <Scene3D />
        <div className="relative z-20 text-center max-w-7xl mx-auto space-y-8 md:space-y-12">
            <div className="hero-badge inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                <Sparkles className="w-5 h-5 text-brand-gold" />
                <span className="text-brand-light-gold font-medium tracking-wide">The Premier AI Agent Platform</span>
            </div>
            <div className="hero-title-container overflow-hidden">
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter">
                    <span className="hero-title-line block">Create <span className="text-shimmer animate-text-shimmer bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-200% bg-clip-text text-transparent">Intelligent</span></span>
                    <span className="hero-title-line block">AI Agents</span>
                </h1>
            </div>
            <p className="hero-subtitle text-lg md:text-xl text-gray-300 max-w-lg md:max-w-3xl mx-auto font-light leading-relaxed">
                The world's most intuitive no-code platform for building, deploying, and scaling sophisticated AI agents that redefine user interaction.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button href="/signup" className="px-8 py-4 text-lg bg-brand-gold hover:bg-brand-light-gold text-black font-bold shadow-lg shadow-brand-gold/20 transform hover:scale-105 transition-all duration-300 rounded-lg">
                    Start Building Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2">
            <span className="font-medium text-gray-400 tracking-widest uppercase text-xs">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
    </section>
);

const GallerySection: FC<{ galleryPinRef: React.RefObject<HTMLDivElement>; horizontalGalleryRef: React.RefObject<HTMLDivElement>; }> = ({ galleryPinRef, horizontalGalleryRef }) => {
    const galleryItems = [
        { type: 'image', src: 'https://images.unsplash.com/photo-1593349480503-685d1a5c6870?q=80&w=2000&auto=format&fit=crop', title: 'AI-Powered Insights', description: 'Understand your customers like never before.' },
        { type: 'video', src: 'https://videos.pexels.com/video-files/4434246/4434246-hd_1920_1080_25fps.mp4', title: 'Dynamic Workflows', description: 'Automate complex processes with ease.' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop', title: 'Seamless Collaboration', description: 'Bring your team together in one platform.' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop', title: 'Global Reach', description: 'Connect with audiences worldwide.' },
    ];
    return (
        <section ref={galleryPinRef} className="relative h-auto bg-transparent py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-24">
                <h2 className="section-heading text-4xl md:text-6xl font-bold mb-4">A Canvas for Your Vision</h2>
                <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">From concept to reality, our platform provides the tools to build stunningly effective AI agents.</p>
            </div>
            <div ref={horizontalGalleryRef} className="flex items-center space-x-4 md:space-x-8 pl-4 md:pl-16 lg:pl-32">
                {galleryItems.map((item, index) => (
                    <div key={index} className="horizontal-gallery-item flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] aspect-video relative rounded-2xl overflow-hidden group">
                        <div className="absolute inset-0 overflow-hidden bg-black">
                            {item.type === 'video' ? (
                                <video className="gallery-item-image w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" autoPlay muted loop playsInline>
                                    <source src={item.src} type="video/mp4" />
                                </video>
                            ) : (
                                <img src={item.src} alt={item.title} className="gallery-item-image w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
                            <p className="text-base md:text-lg text-gray-300">{item.description}</p>
                        </div>
                        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: 'inset 0 0 0 2px #FFD700' }} />
                    </div>
                ))}
                <div className="horizontal-gallery-item flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] aspect-video flex items-center justify-center bg-brand-gray rounded-2xl p-8 text-center">
                    <div className="space-y-6">
                        <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-brand-gold mx-auto" />
                        <h3 className="text-3xl md:text-4xl font-bold">Your Masterpiece Awaits</h3>
                        <p className="text-lg md:text-xl text-gray-400">What will you create?</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

const StatsSection: FC = () => {
    const stats = [
        { value: 50000, label: "Active Agents", suffix: "K+" },
        { value: 99.9, label: "Uptime SLA", suffix: "%" },
        { value: 2000000, label: "Conversations Daily", suffix: "M+" },
        { value: 150, label: "Countries Served", suffix: "+" },
    ];
    return (
        <section className="py-24 md:py-32 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center fade-in-up">
                            <div className="text-5xl sm:text-6xl md:text-7xl font-black mb-2 bg-gradient-to-r from-brand-gold to-brand-light-gold bg-clip-text text-transparent">
                                <span className="stat-value" data-value={stat.value}>0</span>{stat.suffix}
                            </div>
                            <div className="text-sm md:text-base text-gray-400 font-medium tracking-wider uppercase">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
};

const FeaturesSection: FC = () => {
    const features = [
        { icon: <Brain className="w-8 h-8" />, title: "Advanced AI Intelligence", description: "Harnessing state-of-the-art models for hyper-realistic and contextual conversations." },
        { icon: <Rocket className="w-8 h-8" />, title: "Instant Deployment", description: "Go from concept to a live, production-ready agent in minutes, not months." },
        { icon: <Palette className="w-8 h-8" />, title: "Deep Customization", description: "Fine-tune every aspect of your agent's personality, appearance, and behavior." },
        { icon: <Shield className="w-8 h-8" />, title: "Fortress-Grade Security", description: "Protect your data with end-to-end encryption and enterprise-level compliance." },
        { icon: <Globe className="w-8 h-8" />, title: "Infinite Scalability", description: "Our infrastructure effortlessly handles fluctuating demand, from one to one billion users." },
        { icon: <Target className="w-8 h-8" />, title: "Precision Analytics", description: "Gain actionable insights from rich, real-time conversation data and user behavior." }
    ];
    return (
        <section className="features-section py-24 md:py-32 bg-transparent relative">
            <div className="spotlight"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="section-heading text-4xl md:text-6xl font-bold mb-4">Engineered for Excellence</h2>
                    <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">Every feature is meticulously crafted to deliver unparalleled performance and a seamless user experience.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="fade-in-up">
                            <Card className="p-8 h-full bg-brand-gray/80 backdrop-blur-md border border-brand-light-gray/50 rounded-2xl group transition-all duration-300 hover:border-brand-gold/50 hover:bg-brand-light-gray/50">
                                <div className="mb-6">
                                    <div className="inline-flex p-4 rounded-xl bg-brand-light-gray group-hover:bg-brand-gold/20 transition-all duration-300 group-hover:scale-110">
                                        <div className="text-brand-gold">{feature.icon}</div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// --- LANDING PAGE ASSEMBLY ---

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalGalleryRef = useRef<HTMLDivElement>(null);
  const galleryPinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gracefully exit if GSAP is not available
    if (typeof gsap === 'undefined') {
      console.error("GSAP is not loaded. Animations are disabled.");
      return;
    }
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    const ctx = gsap.context(() => {
        // --- EVOLVING BACKGROUND ---
        gsap.to(".evolving-bg", {
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 2,
            },
            '--gradient-start': '#1e3a8a',
            '--gradient-end': '#7c2d12',
        });


      // --- HERO ANIMATION ---
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
      heroTl
        .from('.hero-title-line', { yPercent: 120, stagger: 0.1, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', filter: 'blur(10px)' })
        .from('.hero-subtitle', { opacity: 0, y: 50, duration: 1 }, '-=0.8')
        .from('.hero-buttons', { opacity: 0, y: 30, duration: 1 }, '-=0.6')
        .from('.hero-badge', { opacity: 0, scale: 0.8, y: 50, ease: 'elastic.out(1, 0.75)' }, '-=1');

      // --- GALLERY HORIZONTAL SCROLL ---
      if (horizontalGalleryRef.current) {
        const amountToScroll = horizontalGalleryRef.current.scrollWidth - window.innerWidth;
        gsap.to(horizontalGalleryRef.current, {
          x: -amountToScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: galleryPinRef.current,
            start: 'top top',
            end: `+=${amountToScroll}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // --- GENERAL SECTION FADE-IN ---
      gsap.utils.toArray<HTMLElement>('section').forEach((section) => {
        const heading = section.querySelector('.section-heading');
        const subheading = section.querySelector('.section-subheading');
        const content = section.querySelectorAll('.fade-in-up');
        if (!heading && !subheading && !content.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
        tl.from([heading, subheading], { opacity: 0, y: 50, filter: 'blur(5px)', stagger: 0.1, duration: 1, ease: 'power3.out' })
          .from(content, { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, "-=0.5");
      });

      // --- STATS COUNTER ---
      gsap.utils.toArray<HTMLElement>('.stat-value').forEach(el => {
        const dataVal = parseFloat(el.getAttribute('data-value') || '0');
        gsap.to(el, {
          textContent: dataVal,
          duration: 3,
          ease: "power3.out",
          snap: { textContent: 1 },
          formatter: (value) => {
             if (dataVal >= 1000000) return (value/1000000).toFixed(0);
             if (dataVal >= 1000) return (value/1000).toFixed(0);
             return value.toFixed(dataVal % 1 !== 0 ? 1 : 0);
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        });
      });

      // --- FEATURES SPOTLIGHT ---
      const featuresSection = document.querySelector('.features-section');
      const spotlight = featuresSection?.querySelector('.spotlight');
      if(featuresSection && spotlight){
        featuresSection.addEventListener('mousemove', (e) => {
            const rect = featuresSection.getBoundingClientRect();
            gsap.to(spotlight, {
                duration: 0.5,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-brand-dark text-white font-sans" ref={containerRef}>
      <div className="evolving-bg fixed inset-0 -z-10" style={{'--gradient-start': '#0A0A0A', '--gradient-end': '#1A1A1A'} as React.CSSProperties}></div>
      <HeroSection />
      <main>
        <GallerySection galleryPinRef={galleryPinRef} horizontalGalleryRef={horizontalGalleryRef} />
        <StatsSection />
        <FeaturesSection />
        {/* You can continue adding other sections like Testimonials and CTA here as sub-components */}
      </main>
       <style jsx global>{`
            .evolving-bg {
                background: radial-gradient(at top left, var(--gradient-start), var(--gradient-end));
                transition: --gradient-start 2s, --gradient-end 2s;
            }
            .features-section {
                position: relative;
                overflow: hidden;
            }
            .spotlight {
                position: absolute;
                width: 400px;
                height: 400px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0) 70%);
                pointer-events: none;
                transform: translate(-50%, -50%);
                z-index: 0;
            }
        `}</style>
    </div>
  );
};