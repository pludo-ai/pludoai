import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { 
  Bot, 
  Zap, 
  Globe, 
  Shield, 
  ArrowRight, 
  Check, 
  Star,
  Sparkles,
  Code,
  Palette,
  MessageSquare,
  ChevronDown,
  Brain,
  Rocket,
  Users,
  Award,
  TrendingUp,
  Clock,
  Target,
  Layers
} from 'lucide-react';
import { Button } from '../components/ui/Button'; // Assuming you have these components
import { Card } from '../components/ui/Card';     // Assuming you have these components

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Custom Cursor Component
const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power3.out'
      });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed hidden lg:block w-4 h-4 bg-brand-gold rounded-full pointer-events-none z-50 mix-blend-difference"
    />
  );
};

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalGalleryRef = useRef<HTMLDivElement>(null);
  const galleryPinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- HERO SECTION ANIMATIONS ---
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
      heroTl
        .from('.hero-title-line', { y: 150, stagger: 0.15, clipPath: 'inset(100% 0 0 0)' })
        .from('.hero-subtitle', { opacity: 0, y: 50, duration: 1 }, '-=0.8')
        .from('.hero-buttons', { opacity: 0, y: 30, duration: 1 }, '-=0.6')
        .from('.hero-badge', { opacity: 0, scale: 0.8, y: 50, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, '-=1')
        .from('.scroll-indicator', { opacity: 0, y: 20 }, '-=0.5');

      // --- HORIZONTAL GALLERY ANIMATIONS ---
      // This creates the horizontal scrolling effect for the gallery
      const galleryItems = gsap.utils.toArray('.horizontal-gallery-item');
      gsap.to(horizontalGalleryRef.current, {
        x: () => -(horizontalGalleryRef.current!.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: galleryPinRef.current,
          start: 'top top',
          end: () => `+=${horizontalGalleryRef.current!.scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Parallax effect for gallery item images
      galleryItems.forEach((item: any) => {
        gsap.to(item.querySelector('img, video'), {
          x: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            containerAnimation: gsap.to(horizontalGalleryRef.current, { x: () => -(horizontalGalleryRef.current!.scrollWidth - window.innerWidth), ease: 'none' }).scrollTrigger?.animation,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        });
      });

      // --- GENERAL SCROLL-TRIGGERED ANIMATIONS ---
      const sections = gsap.utils.toArray('section');
      sections.forEach((section: any) => {
        const heading = section.querySelector('.section-heading');
        const subheading = section.querySelector('.section-subheading');
        const content = section.querySelectorAll('.fade-in-up');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        if (heading) tl.from(heading, { opacity: 0, y: 50, duration: 1, ease: 'power3.out' });
        if (subheading) tl.from(subheading, { opacity: 0, y: 40, duration: 1, ease: 'power3.out' }, '-=0.8');
        if (content.length > 0) tl.from(content, { opacity: 0, y: 30, stagger: 0.15, duration: 0.8, ease: 'power3.out' }, '-=0.6');
      });

       // Stats counter animation
      gsap.from(".stat-number", {
        textContent: 0,
        duration: 3,
        ease: "power3.out",
        snap: { textContent: 1 },
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".stats-section",
            start: "top 70%",
        }
      });


    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- DATA ---
  const galleryItems = [
    { type: 'image', src: 'https://images.unsplash.com/photo-1593349480503-685d1a5c6870?q=80&w=2000&auto=format&fit=crop', title: 'AI-Powered Insights', description: 'Understand your customers like never before.' },
    { type: 'video', src: '/hero-video.mp4', title: 'Dynamic Workflows', description: 'Automate complex processes with ease.' },
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
      <CustomCursor />
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-brand-dark to-brand-dark overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20"></div>
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-brand-gold/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-7xl mx-auto space-y-12">
          <div className="hero-badge inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <span className="text-brand-light-gold font-medium tracking-wide">The Premier AI Agent Platform</span>
          </div>
          
          <div className="hero-title-container">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter">
                  <span className="hero-title-line block">Create <span className="text-shimmer animate-text-shimmer bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-200% bg-clip-text text-transparent">Intelligent</span></span>
                  <span className="hero-title-line block">AI Agents</span>
              </h1>
          </div>

          <p className="hero-subtitle text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            The world's most intuitive no-code platform for building, deploying, and scaling sophisticated AI agents that redefine user interaction.
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup">
              <Button size="lg" className="px-10 py-5 text-lg bg-brand-gold hover:bg-brand-light-gold text-black font-bold shadow-lg shadow-brand-gold/20 transform hover:scale-105 transition-all duration-300">
                Start Building Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <button className="flex items-center text-lg text-gray-300 hover:text-white transition-colors group">
              <span className="mr-3">Watch Demo</span>
              <div className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-brand-gold transition-colors flex items-center justify-center">
                <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[7px] border-y-transparent ml-1"></div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
            <span className="font-medium text-gray-400 tracking-widest uppercase text-xs">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </section>

      {/* --- HORIZONTAL GALLERY SECTION --- */}
      <section ref={galleryPinRef} className="relative h-auto bg-brand-dark py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="section-heading text-5xl md:text-6xl font-bold mb-4">A Canvas for Your Vision</h2>
          <p className="section-subheading text-xl text-gray-400 max-w-3xl mx-auto">From concept to reality, our platform provides the tools to build stunningly effective AI agents.</p>
        </div>
        <div ref={horizontalGalleryRef} className="flex space-x-8">
            {galleryItems.map((item, index) => (
                <div key={index} className="horizontal-gallery-item flex-shrink-0 w-[60vw] h-[70vh] relative rounded-2xl overflow-hidden group">
                    {item.type === 'video' ? (
                        <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                            <source src={item.src} type="video/mp4" />
                        </video>
                    ) : (
                        <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                        <p className="text-lg text-gray-300">{item.description}</p>
                    </div>
                </div>
            ))}
            {/* Add a concluding card to the horizontal scroll */}
            <div className="horizontal-gallery-item flex-shrink-0 w-[60vw] h-[70vh] flex items-center justify-center bg-brand-gray rounded-2xl p-8 text-center">
                <div className="space-y-6">
                    <Sparkles className="w-16 h-16 text-brand-gold mx-auto" />
                    <h3 className="text-4xl font-bold">Your Masterpiece Awaits</h3>
                    <p className="text-xl text-gray-400">What will you create?</p>
                </div>
            </div>
        </div>
      </section>
      
      {/* --- STATS SECTION --- */}
      <section className="stats-section py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { number: 50, suffix: "K+", label: "Active AI Agents" },
              { number: 99.9, suffix: "%", label: "Uptime SLA" },
              { number: 2, suffix: "M+", label: "Conversations Daily" },
              { number: 150, suffix: "+", label: "Countries Served" }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-in-up">
                <div className="text-6xl md:text-7xl font-black text-white mb-2">
                  <span className="stat-number" data-value={stat.number}>0</span>
                  <span className="bg-gradient-to-r from-brand-gold to-brand-light-gold bg-clip-text text-transparent">{stat.suffix}</span>
                </div>
                <div className="text-gray-400 text-lg font-medium tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-32 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-heading text-5xl md:text-6xl font-bold mb-4">Engineered for Excellence</h2>
            <p className="section-subheading text-xl text-gray-400 max-w-3xl mx-auto">Every feature is meticulously crafted to deliver unparalleled performance and a seamless user experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="fade-in-up">
                 <Card className="p-8 h-full bg-brand-gray border border-brand-light-gray/50 rounded-2xl group transition-all duration-300 hover:border-brand-gold/50 hover:bg-brand-light-gray/50">
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
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-heading text-5xl md:text-6xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="section-subheading text-xl text-gray-400 max-w-3xl mx-auto">Join the innovators who are transforming their businesses with our platform.</p>
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
      <section className="py-32 relative overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/20 via-brand-dark to-brand-dark"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-12">
            <h2 className="section-heading text-5xl md:text-7xl font-black leading-tight">
              Ready to Build the Future?
            </h2>
            <p className="section-subheading text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of visionary businesses already transforming their customer experience with AI.
            </p>
            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link to="/signup">
                <Button size="lg" className="px-12 py-6 text-xl bg-brand-gold hover:bg-brand-light-gold text-black font-bold shadow-lg shadow-brand-gold/30 transform hover:scale-105 transition-all duration-300 border-2 border-black">
                  Start Your Free Trial <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
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