import React, { useRef, useEffect, Suspense, FC, ReactNode } from 'react';
// Note: react-router-dom's Link is replaced with a standard <a> tag for portability.
// import { Link } from 'react-router-dom';

// Note: GSAP, Three.js, and React-Three-Fiber are assumed to be loaded globally
// in the execution environment (e.g., via script tags in index.html).
// The following imports are removed to prevent bundling errors.
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { TextPlugin } from 'gsap/TextPlugin';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';

import {
  Bot,
  Globe,
  Shield,
  ArrowRight,
  Check,
  Star,
  Sparkles,
  Palette,
  Brain,
  Rocket,
  Target
} from 'lucide-react';

// --- Self-Contained UI Components ---
// The original code referenced external component files. These have been
// recreated here to make the component self-contained and fix resolving errors.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'lg';
  as?: 'button' | 'a';
  href?: string;
}

const Button: FC<ButtonProps> = ({ children, className, size = 'lg', as = 'button', href, ...props }) => {
  const Component = as;
  return (
    <Component className={className} href={href} {...(props as any)}>
      {children}
    </Component>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};


// --- 3D Scene Components (with environment dependency notes) ---
// These components require `three.js` and `@react-three/fiber` to be available in the project.
// We are using placeholder components to prevent errors if these libraries are not loaded.

const MagicParticles = () => {
    // @ts-ignore - useThree is expected to be available globally from @react-three/fiber
    const { size, viewport } = useThree();
    const meshRef = useRef<THREE.InstancedMesh>();

    const dummy = new THREE.Object3D();
    const particles = React.useMemo(() => Array.from({ length: 150 }, () => ({
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() / 2,
        xFactor: -50 + Math.random() * 100,
        yFactor: -50 + Math.random() * 100,
        zFactor: -50 + Math.random() * 100,
    })), []);

    // @ts-ignore - useFrame is expected to be available globally from @react-three/fiber
    useFrame((state) => {
        if (!meshRef.current) return;
        particles.forEach((particle, i) => {
            const t = state.clock.getElapsedTime() * particle.speed;
            dummy.position.set(
                (particle.xFactor + Math.cos(t)) / 10,
                (particle.yFactor + Math.sin(t)) / 10,
                (particle.zFactor + Math.cos(t * 2)) / 10
            );
            const s = Math.cos(t);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            meshRef.current?.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        // @ts-ignore
        <instancedMesh ref={meshRef} args={[null, null, 150]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
        </instancedMesh>
    );
};

const Scene3D = () => {
    // @ts-ignore - Canvas is a component from @react-three/fiber
    const R3FCanvas = typeof Canvas !== 'undefined' ? Canvas : 'div';
    
    // Gracefully fail if React-Three-Fiber is not available.
    // @ts-ignore
    if (typeof Canvas === 'undefined' || typeof useFrame === 'undefined') {
        return (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10">
                {/* Fallback static background */}
            </div>
        );
    }

    return (
        // @ts-ignore
        <R3FCanvas camera={{ fov: 75, position: [0, 0, 5] }} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFD700" />
            <Suspense fallback={null}>
                <MagicParticles />
            </Suspense>
        </R3FCanvas>
    );
};


// --- Main Landing Page Component ---

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalGalleryRef = useRef<HTMLDivElement>(null);
  const galleryPinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure GSAP and its plugins are available before running animations
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof TextPlugin === 'undefined') {
        console.error("GSAP or its plugins are not loaded. Animations will not run.");
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    const ctx = gsap.context(() => {
      // --- HERO SECTION ANIMATIONS ---
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
      heroTl
        .from('.hero-title-line', { yPercent: 120, stagger: 0.15, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' })
        .from('.hero-subtitle', { opacity: 0, y: 50, duration: 1 }, '-=0.8')
        .from('.hero-buttons', { opacity: 0, y: 30, duration: 1 }, '-=0.6')
        .from('.hero-badge', { opacity: 0, scale: 0.8, y: 50, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, '-=1')
        .from('.scroll-indicator', { opacity: 0, y: 20 }, '-=0.5');

      // --- HORIZONTAL GALLERY ANIMATIONS ---
      if (horizontalGalleryRef.current) {
        const galleryWidth = horizontalGalleryRef.current.offsetWidth;
        const amountToScroll = galleryWidth - window.innerWidth;

        gsap.to(horizontalGalleryRef.current, {
          x: -amountToScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: galleryPinRef.current,
            start: 'top top',
            end: `+=${amountToScroll}`,
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        
        const galleryItems = gsap.utils.toArray('.horizontal-gallery-item');
        const containerAnimation = gsap.timeline({ scrollTrigger: { trigger: galleryPinRef.current, start: 'top top', end: `+=${amountToScroll}`, scrub: true } });

        galleryItems.forEach((item: any) => {
          gsap.fromTo(item,
            { scale: 0.8, opacity: 0.5 },
            {
              scale: 1,
              opacity: 1,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: item,
                start: 'left 90%',
                end: 'left 50%',
                scrub: true,
                containerAnimation: containerAnimation,
              },
            }
          );
           gsap.to(item.querySelector('.gallery-item-image'), {
              y: '-15%',
              ease: 'none',
              scrollTrigger: {
                  trigger: item,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                  containerAnimation: containerAnimation,
              }
          });
        });
      }


      // --- GENERAL SCROLL-TRIGGERED ANIMATIONS ---
      gsap.utils.toArray<HTMLElement>('section').forEach((section) => {
        const heading = section.querySelector('.section-heading');
        const subheading = section.querySelector('.section-subheading');
        const content = section.querySelectorAll('.fade-in-up');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        });

        if (heading) tl.from(heading, { opacity: 0, y: 60, duration: 1.2, ease: 'power4.out' });
        if (subheading) tl.from(subheading, { opacity: 0, y: 50, duration: 1, ease: 'power4.out' }, '-=0.9');
        if (content.length > 0) tl.from(content, { opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.7');
      });

      // Stats counter animation
      gsap.utils.toArray<HTMLElement>('.stat-number').forEach(stat => {
          gsap.from(stat, {
              textContent: 0,
              duration: 3,
              ease: "power3.out",
              snap: { textContent: 1 },
              scrollTrigger: {
                  trigger: stat,
                  start: "top 85%",
              }
          });
      });
      
      // Feature cards 3D tilt effect
      gsap.utils.toArray<HTMLElement>('.feature-card').forEach(card => {
          gsap.fromTo(card, {
              transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
              boxShadow: "0 0 0 rgba(255, 215, 0, 0)"
          }, {
              transform: "perspective(1000px) rotateX(-5deg) rotateY(10deg) scale(1.05)",
              boxShadow: "0px 30px 60px rgba(0,0,0,0.4)",
              ease: "power2.out",
              scrollTrigger: {
                  trigger: card,
                  start: "top 70%",
                  end: "bottom top",
                  scrub: true
              }
          })
      })

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- DATA ---
  const galleryItems = [
    { type: 'image', src: 'https://images.unsplash.com/photo-1593349480503-685d1a5c6870?q=80&w=2000&auto=format&fit=crop', title: 'AI-Powered Insights', description: 'Understand your customers like never before.' },
    { type: 'video', src: 'https://videos.pexels.com/video-files/4434246/4434246-hd_1920_1080_25fps.mp4', title: 'Dynamic Workflows', description: 'Automate complex processes with ease.' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop', title: 'Seamless Collaboration', description: 'Bring your team together in one platform.' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop', title: 'Global Reach', description: 'Connect with audiences worldwide.' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1605810230434-7082acec1939?q=80&w=2000&auto=format&fit=crop', title: 'Advanced Analytics', description: 'Data-driven decisions for optimal performance.' },
  ];

  const features = [
    { icon: <Brain className="w-8 h-8" />, title: "Advanced AI Intelligence", description: "Harnessing state-of-the-art models for hyper-realistic and contextual conversations." },
    { icon: <Rocket className="w-8 h-8" />, title: "Instant Deployment", description: "Go from concept to a live, production-ready agent in minutes, not months." },
    { icon: <Palette className="w-8 h-8" />, title: "Deep Customization", description: "Fine-tune every aspect of your agent's personality, appearance, and behavior." },
    { icon: <Shield className="w-8 h-8" />, title: "Fortress-Grade Security", description: "Protect your data with end-to-end encryption and enterprise-level compliance." },
    { icon: <Globe className="w-8 h-8" />, title: "Infinite Scalability", description: "Our infrastructure effortlessly handles fluctuating demand, from one to one billion users." },
    { icon: <Target className="w-8 h-8" />, title: "Precision Analytics", description: "Gain actionable insights from rich, real-time conversation data and user behavior." }
  ];

  const testimonials = [
    { name: "Alexandra Chen", role: "CEO, TechFlow", avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", content: "PLUDO.AI is a paradigm shift. We've seen a 400% increase in user engagement and our support team can now focus on high-value interactions. It’s not just a tool; it’s a team member.", rating: 5, company: "TechFlow" },
    { name: "Marcus Rodriguez", role: "Founder, InnovateLab", avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", content: "The level of sophistication in this no-code platform is astounding. We launched a complex AI agent that has doubled our conversion rates. The ROI was almost immediate.", rating: 5, company: "InnovateLab" },
    { name: "Sarah Williams", role: "VP Marketing, GrowthCorp", avatar: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", content: "Flawless execution. We’ve deployed over 50 client-facing agents without a single technical hiccup. The platform’s reliability and power are simply unmatched.", rating: 5, company: "GrowthCorp" }
  ];


  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-dark text-white font-sans" ref={containerRef}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <Scene3D />
        <div className="absolute inset-0 bg-brand-dark/70 z-10"></div>
        
        <div className="relative z-20 text-center max-w-7xl mx-auto space-y-8 md:space-y-12">
          <div className="hero-badge inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <span className="text-brand-light-gold font-medium tracking-wide">The Premier AI Agent Platform</span>
          </div>
          
          <div className="hero-title-container overflow-hidden">
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter">
                  <span className="hero-title-line block">Create <span className="text-shimmer animate-text-shimmer bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-200% bg-clip-text text-transparent">Intelligent</span></span>
                  <span className="hero-title-line block">AI Agents</span>
              </h1>
          </div>

          <p className="hero-subtitle text-lg md:text-xl text-gray-300 max-w-lg md:max-w-3xl mx-auto font-light leading-relaxed">
            The world's most intuitive no-code platform for building, deploying, and scaling sophisticated AI agents that redefine user interaction.
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button as="a" href="/signup" size="lg" className="px-8 py-4 md:px-10 md:py-5 text-lg bg-brand-gold hover:bg-brand-light-gold text-black font-bold shadow-lg shadow-brand-gold/20 transform hover:scale-105 transition-all duration-300">
              Start Building Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <button className="flex items-center text-lg text-gray-300 hover:text-white transition-colors group">
              <span className="mr-3">Watch Demo</span>
              <div className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-brand-gold transition-colors flex items-center justify-center">
                <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[7px] border-y-transparent ml-1"></div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2">
            <span className="font-medium text-gray-400 tracking-widest uppercase text-xs">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </section>

      {/* --- HORIZONTAL GALLERY SECTION --- */}
      <section ref={galleryPinRef} className="relative h-auto bg-brand-dark py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-24">
          <h2 className="section-heading text-4xl md:text-6xl font-bold mb-4">A Canvas for Your Vision</h2>
          <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">From concept to reality, our platform provides the tools to build stunningly effective AI agents.</p>
        </div>
        <div ref={horizontalGalleryRef} className="flex items-center space-x-4 md:space-x-8 pl-4 md:pl-16">
            {galleryItems.map((item, index) => (
                <div key={index} className="horizontal-gallery-item flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[45vw] aspect-[4/3] relative rounded-2xl overflow-hidden group">
                    <div className="absolute inset-0 overflow-hidden">
                        {item.type === 'video' ? (
                            <video className="gallery-item-image w-full h-[130%] object-cover" autoPlay muted loop playsInline>
                                <source src={item.src} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={item.src} alt={item.title} className="gallery-item-image w-full h-[130%] object-cover" />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
                        <p className="text-base md:text-lg text-gray-300">{item.description}</p>
                    </div>
                </div>
            ))}
            <div className="horizontal-gallery-item flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[45vw] aspect-[4/3] flex items-center justify-center bg-brand-gray rounded-2xl p-8 text-center">
                <div className="space-y-6">
                    <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-brand-gold mx-auto" />
                    <h3 className="text-3xl md:text-4xl font-bold">Your Masterpiece Awaits</h3>
                    <p className="text-lg md:text-xl text-gray-400">What will you create?</p>
                </div>
            </div>
        </div>
      </section>
      
      {/* --- STATS SECTION --- */}
      <section className="py-24 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: 50000, label: "Active AI Agents" },
              { number: 99.9, label: "Uptime SLA", isFloat: true },
              { number: 2000000, label: "Conversations Daily" },
              { number: 150, label: "Countries Served" }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-in-up">
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-2">
                  <span className="stat-number bg-gradient-to-r from-brand-gold to-brand-light-gold bg-clip-text text-transparent" data-value={stat.number}>{stat.number.toLocaleString()}</span>
                   {stat.label.includes("SLA") && "%"}
                   {stat.label.includes("Agents") && "+"}
                   {stat.label.includes("Daily") && "+"}
                   {stat.label.includes("Countries") && "+"}
                </div>
                <div className="text-sm md:text-base text-gray-400 font-medium tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="section-heading text-4xl md:text-6xl font-bold mb-4">Engineered for Excellence</h2>
            <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">Every feature is meticulously crafted to deliver unparalleled performance and a seamless user experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="fade-in-up feature-card">
                 <Card className="p-8 h-full bg-brand-gray border border-brand-light-gray/50 rounded-2xl group transition-all duration-300">
                   <div className="mb-6">
                     <div className="inline-flex p-4 rounded-xl bg-brand-light-gray group-hover:bg-brand-gold/20 transition-colors duration-300">
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
      
      {/* --- TESTIMONIALS --- */}
      <section className="py-24 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="section-heading text-4xl md:text-6xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">Join the innovators who are transforming their businesses with our platform.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="fade-in-up">
                <Card className="p-8 h-full bg-brand-dark border border-brand-light-gray/50 rounded-2xl flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-brand-gold fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 mb-6 italic text-lg leading-relaxed flex-grow">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center mt-auto">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4 border-2 border-brand-gold/50" />
                    <div>
                      <div className="font-bold text-white text-lg">{testimonial.name}</div>
                      <div className="text-brand-gold text-sm font-medium">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/20 via-brand-dark to-brand-dark"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-12">
            <h2 className="section-heading text-4xl sm:text-5xl md:text-7xl font-black leading-tight">
              Ready to Build the Future?
            </h2>
            <p className="section-subheading text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of visionary businesses already transforming their customer experience with AI.
            </p>
            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-6">
               <Button as="a" href="/signup" size="lg" className="px-10 py-5 md:px-12 md:py-6 text-xl bg-brand-gold hover:bg-brand-light-gold text-black font-bold shadow-lg shadow-brand-gold/30 transform hover:scale-105 transition-all duration-300 border-2 border-black">
                  Start Your Free Trial <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
            </div>
            <div className="fade-in-up flex items-center justify-center text-gray-400 text-lg font-medium">
               <Check className="w-6 h-6 mr-3 text-brand-gold" />
               Free forever plan • No credit card required
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
