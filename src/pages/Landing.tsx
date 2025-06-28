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
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section with premium animations
      const heroTl = gsap.timeline();
      
      heroTl.from(".hero-badge", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
      })
      .from(".hero-title", {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "power4.out"
      }, "-=0.5")
      .from(".hero-subtitle", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .from(".hero-buttons", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.5")
      .from(".hero-stats", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.3");

      // Floating particles
      gsap.to(".particle", {
        y: -200,
        opacity: 0,
        duration: 4,
        stagger: {
          amount: 3,
          from: "random"
        },
        repeat: -1,
        ease: "power2.out"
      });

      // Gallery section with masonry-style reveals
      ScrollTrigger.create({
        trigger: galleryRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(".gallery-item", 
            { 
              opacity: 0, 
              scale: 0.8,
              rotationY: 45,
              z: -100
            },
            { 
              opacity: 1, 
              scale: 1,
              rotationY: 0,
              z: 0,
              duration: 1.2,
              stagger: {
                amount: 2,
                from: "random"
              },
              ease: "power3.out"
            }
          );
        }
      });

      // Stats counter animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.fromTo(".stat-number", 
            { textContent: 0 },
            { 
              textContent: (i, target) => target.getAttribute('data-value'),
              duration: 2,
              ease: "power2.out",
              snap: { textContent: 1 },
              stagger: 0.2
            }
          );
        }
      });

      // Features with 3D perspective
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.fromTo(".feature-card", 
            { 
              opacity: 0, 
              rotationX: 60,
              y: 100,
              z: -200
            },
            { 
              opacity: 1, 
              rotationX: 0,
              y: 0,
              z: 0,
              duration: 1.5,
              stagger: 0.2,
              ease: "power3.out"
            }
          );
        }
      });

      // Showcase with parallax
      ScrollTrigger.create({
        trigger: showcaseRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(".showcase-bg", {
            yPercent: -50 * self.progress,
            ease: "none"
          });
        }
      });

      // Testimonials carousel effect
      ScrollTrigger.create({
        trigger: testimonialsRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.fromTo(".testimonial-card", 
            { 
              opacity: 0, 
              x: (i) => i % 2 === 0 ? -100 : 100,
              rotationY: 30
            },
            { 
              opacity: 1, 
              x: 0,
              rotationY: 0,
              duration: 1.2,
              stagger: 0.3,
              ease: "power3.out"
            }
          );
        }
      });

      // CTA with magnetic effect
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(ctaRef.current, 
            { 
              opacity: 0, 
              scale: 0.9,
              rotationX: 30
            },
            { 
              opacity: 1, 
              scale: 1,
              rotationX: 0,
              duration: 1.5,
              ease: "power3.out"
            }
          );
        }
      });

      // Continuous background animations
      gsap.to(".bg-gradient-1", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      gsap.to(".bg-gradient-2", {
        rotation: -360,
        duration: 25,
        repeat: -1,
        ease: "none"
      });

      // Text reveals on scroll
      gsap.utils.toArray('.reveal-text').forEach((element: any) => {
        gsap.fromTo(element, 
          { 
            opacity: 0, 
            y: 50,
            clipPath: "inset(100% 0 0 0)"
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const galleryItems = [
    {
      type: 'image',
      src: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'AI-Powered Customer Support',
      description: 'Intelligent responses that understand context and provide accurate solutions',
      size: 'large'
    },
    {
      type: 'image',
      src: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Real-time Analytics',
      description: 'Track performance and optimize your AI agent',
      size: 'medium'
    },
    {
      type: 'video',
      src: '/hero-video.mp4',
      title: 'Seamless Integration',
      description: 'Deploy anywhere with a single line of code',
      size: 'large'
    },
    {
      type: 'image',
      src: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Custom Branding',
      description: 'Match your brand perfectly',
      size: 'small'
    },
    {
      type: 'image',
      src: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Multi-language Support',
      description: 'Serve customers globally',
      size: 'medium'
    },
    {
      type: 'image',
      src: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Advanced AI Models',
      description: 'Powered by the latest AI technology',
      size: 'large'
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Advanced AI Intelligence",
      description: "Powered by cutting-edge language models for natural, contextual conversations",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Lightning Fast Deployment",
      description: "From concept to live agent in under 5 minutes with automated infrastructure",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Pixel-Perfect Customization",
      description: "Complete control over design, personality, and behavior to match your brand",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with SOC2, GDPR, and HIPAA standards",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Scale",
      description: "Auto-scaling infrastructure that handles millions of conversations worldwide",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision Analytics",
      description: "Deep insights into customer behavior and conversation performance",
      color: "from-rose-500 to-pink-500"
    }
  ];

  const testimonials = [
    {
      name: "Alexandra Chen",
      role: "CEO, TechFlow",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
      content: "PLUDO.AI transformed our customer experience overnight. 400% increase in engagement and 70% reduction in support tickets.",
      rating: 5,
      company: "TechFlow"
    },
    {
      name: "Marcus Rodriguez",
      role: "Founder, InnovateLab",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
      content: "The most sophisticated no-code AI platform I've ever used. Our conversion rates doubled within the first month.",
      rating: 5,
      company: "InnovateLab"
    },
    {
      name: "Sarah Williams",
      role: "VP Marketing, GrowthCorp",
      avatar: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
      content: "Incredible ROI. We've deployed 50+ AI agents for clients with zero technical issues. Pure magic.",
      rating: 5,
      company: "GrowthCorp"
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-black" ref={containerRef}>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Premium Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-gradient-1 absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full blur-3xl"></div>
          <div className="bg-gradient-2 absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-silver-400/20 to-gray-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
          
          {/* Floating Particles */}
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#C0C0C0' : '#FFFFFF',
                opacity: Math.random() * 0.5 + 0.2,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-12">
            {/* Premium Badge */}
            <div className="hero-badge inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-xl px-8 py-4 rounded-full border border-amber-500/30 shadow-2xl">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-amber-200 font-medium tracking-wide">Premium AI Agent Platform</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>

            {/* Hero Title */}
            <div className="hero-title space-y-6">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tight">
                <span className="block">Create</span>
                <span className="block bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  Intelligent
                </span>
                <span className="block">AI Agents</span>
              </h1>
              <div className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide">
                in <span className="text-amber-400 font-semibold">minutes</span>, not months
              </div>
            </div>

            {/* Hero Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
              The world's most advanced no-code platform for creating, customizing, and deploying 
              AI agents that transform customer experiences and drive business growth.
            </p>

            {/* Hero Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="px-12 py-6 text-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-400/50"
                >
                  Start Building Free
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              
              <button className="flex items-center space-x-4 text-white hover:text-amber-300 transition-colors group">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-gray-600/50 group-hover:border-amber-500/50 transition-all duration-300">
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                </div>
                <span className="font-medium text-lg">Watch Demo</span>
              </button>
            </div>

            {/* Hero Stats */}
            <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
              {[
                { value: "50K+", label: "AI Agents Created" },
                { value: "99.9%", label: "Uptime Guarantee" },
                { value: "150+", label: "Countries Served" },
                { value: "24/7", label: "Expert Support" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center space-y-3 text-gray-400">
            <span className="text-sm font-medium tracking-wide">Discover More</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="py-32 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="reveal-text text-5xl md:text-6xl font-bold text-white mb-6">
              Experience the{' '}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Future
              </span>
            </h2>
            <p className="reveal-text text-xl text-gray-400 max-w-3xl mx-auto">
              Every pixel crafted for perfection. Every interaction designed for delight.
            </p>
          </div>

          {/* Masonry Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className={`gallery-item group relative overflow-hidden rounded-3xl shadow-2xl border border-gray-800/50 hover:border-amber-500/30 transition-all duration-500 ${
                  item.size === 'large' ? 'md:col-span-2 lg:row-span-2' :
                  item.size === 'medium' ? 'lg:row-span-1' : ''
                }`}
              >
                {item.type === 'video' ? (
                  <video
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                </div>

                {/* Gold accent */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Fixed Background */}
      <section ref={statsRef} className="py-32 relative">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" style={{ zIndex: -1 }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="reveal-text text-5xl md:text-6xl font-bold text-white mb-6">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-silver-400 to-gray-300 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: 50000, suffix: "+", label: "Active AI Agents", icon: <Bot className="w-8 h-8" /> },
              { number: 99, suffix: ".9%", label: "Uptime SLA", icon: <Shield className="w-8 h-8" /> },
              { number: 2, suffix: "M+", label: "Conversations Daily", icon: <MessageSquare className="w-8 h-8" /> },
              { number: 150, suffix: "+", label: "Countries", icon: <Globe className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl border border-amber-500/30 group-hover:border-amber-400/50 transition-all duration-300">
                    <div className="text-amber-400">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div className="text-5xl md:text-6xl font-black text-white mb-3">
                  <span className="stat-number" data-value={stat.number}>0</span>
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">{stat.suffix}</span>
                </div>
                <div className="text-gray-400 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-silver-400 to-gray-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="reveal-text text-5xl md:text-6xl font-bold text-white mb-6">
              Engineered for{' '}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="reveal-text text-xl text-gray-400 max-w-3xl mx-auto">
              Every feature meticulously crafted to deliver unparalleled performance and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group"
                style={{ perspective: '1000px' }}
              >
                <Card className="p-8 h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500 group-hover:shadow-2xl">
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Gold accent line */}
                  <div className="mt-6 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section with Parallax */}
      <section ref={showcaseRef} className="py-32 relative overflow-hidden">
        <div className="showcase-bg absolute inset-0 bg-gradient-to-br from-amber-900/20 to-yellow-900/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="reveal-text text-5xl md:text-6xl font-bold text-white leading-tight">
                Deploy{' '}
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Anywhere
                </span>
                <br />
                Scale{' '}
                <span className="bg-gradient-to-r from-silver-400 to-gray-300 bg-clip-text text-transparent">
                  Everywhere
                </span>
              </h2>
              <p className="reveal-text text-xl text-gray-400 leading-relaxed">
                From startup to enterprise, our platform scales seamlessly with your business. 
                Deploy on any platform, integrate with any system, serve any audience.
              </p>
              <div className="reveal-text space-y-4">
                {[
                  "One-click deployment to 150+ platforms",
                  "Auto-scaling infrastructure handles millions",
                  "99.9% uptime with global CDN",
                  "Enterprise-grade security & compliance"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700/50 backdrop-blur-xl p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-4 h-full">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl border border-amber-500/30 flex items-center justify-center"
                      style={{
                        animationDelay: `${i * 0.1}s`
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg opacity-60"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-32 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="reveal-text text-5xl md:text-6xl font-bold text-white mb-6">
              What Leaders{' '}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="reveal-text text-xl text-gray-400 max-w-3xl mx-auto">
              Join the ranks of industry pioneers who've transformed their businesses with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card group"
              >
                <Card className="p-8 h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500 group-hover:shadow-2xl">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 mb-8 italic text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4 shadow-lg border-2 border-amber-500/30"
                    />
                    <div>
                      <div className="font-bold text-white text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-amber-400 text-sm font-medium">
                        {testimonial.role}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-silver-400/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Ready to Lead the{' '}
              <span className="text-black">
                AI Revolution?
              </span>
            </h2>
            <p className="text-2xl text-amber-100 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of visionary businesses already transforming their customer experience with AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="px-12 py-6 text-xl bg-black text-amber-400 hover:bg-gray-900 shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-black font-bold"
                >
                  Start Your Journey
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <div className="flex items-center text-amber-100 text-lg font-medium">
                <Check className="w-6 h-6 mr-3" />
                Free forever • No credit card required
              </div>
            </div>
            
            {/* Premium guarantee badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12">
              {[
                { icon: <Award className="w-6 h-6" />, text: "99.9% Uptime SLA" },
                { icon: <Users className="w-6 h-6" />, text: "24/7 Expert Support" },
                { icon: <TrendingUp className="w-6 h-6" />, text: "ROI Guaranteed" },
                { icon: <Clock className="w-6 h-6" />, text: "5-Min Setup" }
              ].map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 text-amber-200">
                  {badge.icon}
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};