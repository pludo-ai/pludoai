import React, { useRef, useEffect, useState, FC, ReactNode } from 'react';

// --- DEPENDENCY NOTES ---
// This component is designed to be self-contained to prevent build errors.
// It assumes the following libraries are loaded globally in your project (e.g., via <script> tags):
// 1. GSAP (Core, ScrollTrigger, TextPlugin)
// 2. Lucide-React (for icons)
// 3. React & ReactDOM

// The following imports are for reference and are not active.
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { TextPlugin } from 'gsap/TextPlugin';
// import { Link } from 'react-router-dom';
import {
  Brain, Rocket, Palette, Shield, Globe, Target, Sparkles, ArrowRight,
  Play, Pause, Volume2, VolumeX, Check, Star, Settings, Code,
  Monitor, Tablet, Smartphone, Bot, ChevronDown, Github, Twitter, Linkedin, Mail,
} from 'lucide-react';


// --- SELF-CONTAINED UI COMPONENTS ---

const Button: FC<{ children: ReactNode; className?: string; href?: string; variant?:'outline' }> = ({ children, className, href, variant }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 transform hover:scale-105";
    const variantClasses = variant === 'outline'
        ? 'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black'
        : 'bg-brand-gold hover:bg-brand-light-gold text-black shadow-lg shadow-brand-gold/30';
    return (
        <a href={href} className={`${baseClasses} ${variantClasses} ${className}`}>
            {children}
        </a>
    );
};

const Card: FC<{ children: ReactNode; className?: string; }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);


// --- PAGE SECTIONS (as sub-components) ---

const HeroSection: FC = () => {
    const [isMuted, setIsMuted] = useState(true);
    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
            <video
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ filter: 'brightness(0.4)' }}
            >
                <source src="https://videos.pexels.com/video-files/852441/852441-hd_1920_1080_25fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-brand-dark/50 to-brand-dark z-10" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-5 z-10" />

            <div className="relative z-20 text-center max-w-7xl mx-auto space-y-8 md:space-y-12">
                <div className="hero-badge inline-flex items-center space-x-3 bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10">
                    <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
                    <span className="text-brand-light-gold font-medium tracking-wide">The Future of AI is Here</span>
                </div>
                <div>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none">
                        <span className="hero-title-word-container block"><span className="hero-title-word">Build</span></span>
                        <span className="hero-title-word-container block">
                            <span className="hero-title-word bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-200% bg-clip-text text-transparent animate-text-shimmer">Intelligent</span>
                        </span>
                        <span className="hero-title-word-container block"><span className="hero-title-word">AI Agents</span></span>
                    </h1>
                </div>
                <p className="hero-subtitle text-lg md:text-xl text-gray-300 max-w-lg md:max-w-4xl mx-auto font-light leading-relaxed">
                    The world's most advanced no-code platform for creating, deploying, and scaling sophisticated AI agents that transform customer experiences.
                </p>
                <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button href="/signup" className="px-8 py-4 text-lg">
                        Start Building Free <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <button onClick={() => setIsMuted(!isMuted)} className="flex items-center text-lg text-gray-300 hover:text-white transition-colors group">
                        <span className="mr-3">Watch Demo</span>
                        <div className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-brand-gold transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/5">
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </div>
                    </button>
                </div>
            </div>
            <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2">
                <span className="text-gray-400 text-xs uppercase tracking-widest">Explore</span>
                <ChevronDown className="w-5 h-5 text-brand-gold animate-bounce" />
            </div>
        </section>
    );
};

const GallerySection: FC<{ galleryPinRef: React.RefObject<HTMLDivElement>; horizontalGalleryRef: React.RefObject<HTMLDivElement>; }> = ({ galleryPinRef, horizontalGalleryRef }) => {
    const galleryItems = [
        { type: 'image', src: 'https://images.unsplash.com/photo-1593349480503-685d1a5c6870?q=80&w=2000&auto=format&fit=crop', title: 'AI-Powered Insights' },
        { type: 'video', src: 'https://videos.pexels.com/video-files/4434246/4434246-hd_1920_1080_25fps.mp4', title: 'Dynamic Workflows' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop', title: 'Seamless Collaboration' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop', title: 'Global Reach' },
    ];
    return (
        <section ref={galleryPinRef} className="relative h-auto bg-brand-dark py-24 md:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-24">
                <h2 className="section-heading text-4xl md:text-6xl font-bold mb-4">A Canvas for Your Vision</h2>
                <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">From concept to reality, our platform provides the tools to build stunningly effective AI agents.</p>
            </div>
            <div ref={horizontalGalleryRef} className="flex items-center space-x-4 md:space-x-8 pl-4 md:pl-16 lg:pl-32">
                {galleryItems.map((item, index) => (
                    <div key={index} className="horizontal-gallery-item flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] aspect-video relative rounded-2xl md:rounded-3xl overflow-hidden group">
                        <div className="absolute inset-0 bg-black">
                            {item.type === 'video' ? (
                                <video className="gallery-item-image w-full h-[130%] object-cover" autoPlay muted loop playsInline><source src={item.src} type="video/mp4" /></video>
                            ) : (
                                <img src={item.src} alt={item.title} className="gallery-item-image w-full h-[130%] object-cover" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:p-8">
                            <h3 className="text-2xl md:text-3xl font-bold">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const IntegrationsSection: FC = () => {
    const logos = ['Slack', 'HubSpot', 'Salesforce', 'Zendesk', 'Intercom', 'Zapier', 'Shopify', 'Discord'];
    return (
        <section className="py-24 bg-black text-center">
            <h2 className="section-heading text-3xl md:text-4xl font-bold mb-4">Integrates With Your Tools</h2>
            <p className="section-subheading text-lg text-gray-400 mb-12">Connect seamlessly with the platforms you already use.</p>
            <div className="relative w-full overflow-hidden">
                <div className="flex animate-marquee">
                    {[...logos, ...logos].map((logo, index) => (
                        <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center h-16">
                            <p className="text-2xl font-bold text-gray-500">{logo}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PricingSection: FC = () => {
    const pricingPlans = [
        { name: "Starter", price: "Free", description: "Perfect for individuals and small projects.", features: ["1 AI Agent", "1,000 conversations/mo", "Basic customization", "Community support"], cta: "Start for Free", popular: false },
        { name: "Professional", price: "$29", description: "For growing businesses and startups.", features: ["5 AI Agents", "10,000 conversations/mo", "Advanced customization", "Priority support", "Analytics dashboard"], cta: "Start Trial", popular: true },
        { name: "Enterprise", price: "Custom", description: "For large-scale, custom deployments.", features: ["Unlimited Agents", "Unlimited conversations", "Dedicated support & SLA", "On-premise option"], cta: "Contact Sales", popular: false },
    ];
    return (
        <section className="py-24 md:py-32 bg-brand-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="section-heading text-4xl md:text-6xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">Choose the perfect plan for your business. Start free, scale as you grow.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {pricingPlans.map((plan) => (
                        <div key={plan.name} className="fade-in-up flex">
                            <Card className={`p-8 w-full flex flex-col rounded-3xl transition-all duration-300 ${plan.popular ? 'bg-brand-gray border-2 border-brand-gold transform-none lg:scale-110' : 'bg-gradient-to-br from-brand-gray to-black border border-brand-light-gray/30 hover:border-brand-gold/50'}`}>
                                {plan.popular && <div className="text-center mb-6"><span className="bg-brand-gold text-black px-4 py-1 rounded-full text-sm font-bold">Most Popular</span></div>}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="text-4xl lg:text-5xl font-black text-white mb-2">{plan.price}{plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-lg text-gray-400 font-normal">/mo</span>}</div>
                                    <p className="text-gray-400 h-12">{plan.description}</p>
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature) => (<li key={feature} className="flex items-center"><Check className="w-5 h-5 text-brand-gold mr-3 flex-shrink-0" /> <span className="text-gray-300">{feature}</span></li>))}
                                </ul>
                                <Button href="/signup" className={`w-full py-3 text-lg mt-auto ${plan.popular ? '' : 'variant-outline'}`}>{plan.cta}</Button>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer: FC = () => (
    <footer className="bg-black border-t border-brand-light-gray/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold">PLUDO.AI</h3>
                    <p className="text-gray-400">The Future of AI Agents.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-brand-gold"><Twitter /></a>
                        <a href="#" className="text-gray-400 hover:text-brand-gold"><Github /></a>
                        <a href="#" className="text-gray-400 hover:text-brand-gold"><Linkedin /></a>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Product</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Demo</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Company</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Contact</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center"><Mail className="w-4 h-4 mr-2"/> contact@pludo.ai</li>
                        <li className="flex items-center"><MapPin className="w-4 h-4 mr-2"/> San Francisco, CA</li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-brand-light-gray/20 pt-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} PLUDO.AI Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
);


// --- MAIN LANDING PAGE ASSEMBLY ---

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalGalleryRef = useRef<HTMLDivElement>(null);
  const galleryPinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gracefully exit if GSAP is not available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.error("GSAP or ScrollTrigger not available. Animations disabled.");
      return;
    }
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    const ctx = gsap.context(() => {
      // Hero Animations
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
      heroTl
        .from('.hero-badge', { opacity: 0, scale: 0.8, y: 50, ease: 'elastic.out(1, 0.75)' })
        .from('.hero-title-word', { yPercent: 120, opacity: 0, stagger: 0.1, duration: 1 }, '-=0.8')
        .from('.hero-subtitle', { opacity: 0, y: 50 }, '-=0.6')
        .from('.hero-buttons', { opacity: 0, y: 30 }, '-=0.5')
        .from('.scroll-indicator', { opacity: 0 }, '-=0.5');

      // Gallery Horizontal Scroll
      if (galleryPinRef.current && horizontalGalleryRef.current) {
        let amountToScroll = horizontalGalleryRef.current.scrollWidth - window.innerWidth;
        gsap.to(horizontalGalleryRef.current, {
          x: -amountToScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: galleryPinRef.current,
            start: 'top top',
            end: () => `+=${amountToScroll}`,
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        
        // Gallery items parallax effect
        const galleryItems = gsap.utils.toArray('.horizontal-gallery-item');
        galleryItems.forEach((item: any) => {
            gsap.to(item.querySelector('.gallery-item-image'), {
                y: '-15%',
                ease: 'none',
                scrollTrigger: {
                    trigger: item,
                    start: 'left right',
                    end: 'right left',
                    scrub: true,
                    containerAnimation: gsap.to(horizontalGalleryRef.current, {x:()=> -amountToScroll}).scrollTrigger!.animation
                }
            })
        });
      }

      // General Section Heading Animations
      gsap.utils.toArray<HTMLElement>('.section-heading, .section-subheading').forEach(el => {
        gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });
      gsap.utils.toArray<HTMLElement>('.fade-in-up').forEach(el => {
         gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        });
      })
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-brand-dark text-white font-sans" ref={containerRef}>
      <main>
        <HeroSection />
        <GallerySection galleryPinRef={galleryPinRef} horizontalGalleryRef={horizontalGalleryRef} />
        <IntegrationsSection />
        <PricingSection />
      </main>
      <Footer />
       <style jsx global>{`
            .hero-title-word-container { display: inline-block; overflow: hidden; }
            .hero-title-word { display: inline-block; }
            @keyframes marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
            .animate-marquee {
                animation: marquee 40s linear infinite;
            }
       `}</style>
    </div>
  );
};