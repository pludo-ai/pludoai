import React, { useRef, useEffect, useState } from 'react';
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
  Layers,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  Download,
  Eye,
  Settings,
  Database,
  Cloud,
  Lock,
  Cpu,
  Smartphone,
  Monitor,
  Tablet,
  Infinity,
  Gem,
  Crown,
  Diamond,
  Briefcase,
  Building,
  Headphones,
  ShoppingCart,
  BarChart3,
  Lightbulb,
  Mic,
  Camera,
  Video,
  Image as ImageIcon,
  FileText,
  Calendar,
  Clock3,
  Zap as Lightning
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Luxury Floating Particles Component
const LuxuryParticles: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = particlesRef.current?.children;
    if (!particles) return;

    Array.from(particles).forEach((particle, index) => {
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.4 + 0.1
      });

      gsap.to(particle, {
        y: '-=150',
        x: `+=${Math.random() * 300 - 150}`,
        rotation: 360,
        duration: Math.random() * 30 + 15,
        repeat: -1,
        yoyo: true,
        ease: 'none'
      });
    });
  }, []);

  return (
    <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-0">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${
            i % 3 === 0 ? 'bg-brand-gold' : i % 3 === 1 ? 'bg-brand-silver' : 'bg-brand-platinum'
          } ${
            i % 4 === 0 ? 'w-2 h-2' : i % 4 === 1 ? 'w-1 h-1' : i % 4 === 2 ? 'w-3 h-3' : 'w-1.5 h-1.5'
          } opacity-20 blur-sm`}
        />
      ))}
    </div>
  );
};

// Enhanced Interactive Demo Component
const PremiumDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  const demoSteps = [
    { 
      title: "Luxury Design", 
      description: "Craft your agent's premium appearance",
      icon: <Crown className="w-6 h-6" />,
      color: "from-brand-gold to-brand-light-gold"
    },
    { 
      title: "AI Intelligence", 
      description: "Select from elite AI models",
      icon: <Brain className="w-6 h-6" />,
      color: "from-brand-silver to-brand-light-silver"
    },
    { 
      title: "Instant Deploy", 
      description: "Launch with enterprise precision",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-brand-platinum to-white"
    },
    { 
      title: "Global Reach", 
      description: "Embed across all platforms",
      icon: <Globe className="w-6 h-6" />,
      color: "from-brand-dark-gold to-brand-gold"
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, demoSteps.length]);

  return (
    <div className="relative bg-gradient-to-br from-brand-dark via-brand-dark-gray to-black rounded-3xl p-8 border border-brand-gold/30 shadow-2xl shadow-brand-gold/20 overflow-hidden">
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold via-transparent to-brand-silver animate-gradient bg-300%" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-brand-gold rounded-full animate-pulse" />
            <h3 className="text-2xl font-bold text-white tracking-wide">Live Demonstration</h3>
            <div className="w-3 h-3 bg-brand-silver rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-brand-gold to-brand-light-gold text-black rounded-full font-bold hover:from-brand-light-gold hover:to-brand-gold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-gold/30"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isPlaying ? 'Pause Demo' : 'Play Demo'}</span>
          </button>
        </div>
        
        <div className="space-y-6">
          {demoSteps.map((step, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl transition-all duration-700 transform ${
                currentStep === index
                  ? 'bg-gradient-to-r from-brand-gold/20 to-brand-silver/20 border border-brand-gold/60 scale-105 shadow-xl shadow-brand-gold/20'
                  : 'bg-brand-light-gray/20 border border-brand-light-gray/30 hover:border-brand-silver/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-500 ${
                  currentStep === index 
                    ? `bg-gradient-to-r ${step.color} text-black shadow-lg` 
                    : 'bg-brand-light-gray/50 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-lg transition-colors duration-500 ${
                    currentStep === index ? 'text-brand-gold' : 'text-white'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm transition-colors duration-500 ${
                    currentStep === index ? 'text-gray-200' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {currentStep === index && (
                  <div className="w-4 h-4 bg-brand-gold rounded-full animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Premium Gallery Component
const PremiumGallery: React.FC = () => {
  const galleryImages = [
    {
      src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      title: "Enterprise Dashboard",
      description: "Sophisticated analytics and insights"
    },
    {
      src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      title: "AI Conversations",
      description: "Natural, intelligent interactions"
    },
    {
      src: "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      title: "Global Deployment",
      description: "Worldwide reach and reliability"
    },
    {
      src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      title: "Custom Branding",
      description: "Perfectly aligned with your brand"
    },
    {
      src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      title: "Mobile Excellence",
      description: "Flawless cross-device experience"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="flex space-x-8 animate-slide-left">
        {[...galleryImages, ...galleryImages].map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 h-64 relative rounded-2xl overflow-hidden border border-brand-gold/30 shadow-2xl shadow-brand-gold/20 group"
          >
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-white font-bold text-lg mb-1">{image.title}</h4>
              <p className="text-brand-light-gold text-sm">{image.description}</p>
            </div>
            <div className="absolute top-4 right-4 w-3 h-3 bg-brand-gold rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Horizontal Scrolling Features Component
const HorizontalFeatures: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Neural Intelligence",
      description: "Advanced AI models with human-like reasoning capabilities",
      gradient: "from-purple-600 to-pink-600",
      stats: "99.9% Accuracy"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Fort Knox Security",
      description: "Military-grade encryption and enterprise compliance",
      gradient: "from-green-600 to-emerald-600",
      stats: "SOC 2 Certified"
    },
    {
      icon: <Lightning className="w-12 h-12" />,
      title: "Lightning Deploy",
      description: "From concept to production in under 60 seconds",
      gradient: "from-yellow-600 to-orange-600",
      stats: "< 60 Seconds"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Global Scale",
      description: "Worldwide CDN with 99.99% uptime guarantee",
      gradient: "from-blue-600 to-cyan-600",
      stats: "150+ Countries"
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Infinite Customization",
      description: "Complete brand control with pixel-perfect precision",
      gradient: "from-indigo-600 to-purple-600",
      stats: "Unlimited Themes"
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Deep Analytics",
      description: "Real-time insights with predictive intelligence",
      gradient: "from-red-600 to-pink-600",
      stats: "Real-time Data"
    }
  ];

  return (
    <div className="relative overflow-hidden py-8">
      <div className="flex space-x-8 animate-slide-right">
        {[...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-96 p-8 bg-gradient-to-br from-brand-dark-gray to-brand-dark rounded-3xl border border-brand-gold/30 shadow-2xl shadow-brand-gold/10 group hover:shadow-brand-gold/30 transition-all duration-500 transform hover:scale-105"
          >
            <div className="mb-6">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} bg-opacity-20 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white">{feature.icon}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-brand-gold transition-colors">
                  {feature.title}
                </h3>
                <span className="text-brand-gold text-sm font-bold bg-brand-gold/20 px-3 py-1 rounded-full">
                  {feature.stats}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                {feature.description}
              </p>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-brand-gold to-brand-silver rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Premium Device Showcase
const DeviceShowcase: React.FC = () => {
  const devices = [
    { type: 'mobile', icon: <Smartphone className="w-8 h-8" />, size: 'w-32 h-56' },
    { type: 'tablet', icon: <Tablet className="w-10 h-10" />, size: 'w-48 h-64' },
    { type: 'desktop', icon: <Monitor className="w-12 h-12" />, size: 'w-80 h-48' }
  ];

  return (
    <div className="flex items-end justify-center space-x-12">
      {devices.map((device, index) => (
        <div key={device.type} className="text-center group">
          <div className={`${device.size} bg-gradient-to-br from-brand-dark-gray via-brand-dark to-black rounded-3xl border-2 border-brand-gold/40 p-6 relative overflow-hidden shadow-2xl shadow-brand-gold/20 group-hover:shadow-brand-gold/40 transition-all duration-500 transform group-hover:scale-105`}>
            {/* Screen Content */}
            <div className="w-full h-full bg-gradient-to-br from-brand-gold/10 to-brand-silver/10 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
                <div className="text-brand-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {device.icon}
                </div>
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mb-4 shadow-lg shadow-brand-gold/30 group-hover:rotate-12 transition-transform duration-300">
                  <Bot className="w-8 h-8 text-black" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-brand-gold/30 rounded-full">
                    <div className="w-3/4 h-full bg-brand-gold rounded-full animate-pulse" />
                  </div>
                  <div className="w-full h-2 bg-brand-silver/30 rounded-full">
                    <div className="w-1/2 h-full bg-brand-silver rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Luxury Accent */}
            <div className="absolute top-4 right-4 w-4 h-4 bg-brand-gold rounded-full animate-pulse" />
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-brand-silver rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <p className="text-brand-light-gold font-medium mt-6 capitalize tracking-wider">
            {device.type}
          </p>
        </div>
      ))}
    </div>
  );
};

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [videoMuted, setVideoMuted] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Luxury hero animations with sophisticated timing
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      
      heroTl
        .from('.hero-badge', { 
          opacity: 0, 
          scale: 0.8, 
          y: 50, 
          duration: 1.5, 
          ease: 'elastic.out(1, 0.75)' 
        })
        .from('.hero-title-word', { 
          y: 200, 
          opacity: 0,
          rotationX: 90,
          stagger: 0.15, 
          duration: 2,
          ease: 'power4.out'
        }, '-=1')
        .from('.hero-subtitle', { 
          opacity: 0, 
          y: 60, 
          duration: 1.5 
        }, '-=0.8')
        .from('.hero-buttons', { 
          opacity: 0, 
          y: 40, 
          scale: 0.9,
          duration: 1.2 
        }, '-=0.6')
        .from('.hero-stats', { 
          opacity: 0, 
          y: 30, 
          stagger: 0.15, 
          duration: 1 
        }, '-=0.4');

      // Advanced scroll-triggered animations with 3D effects
      gsap.utils.toArray('.fade-in-up').forEach((element: any) => {
        gsap.fromTo(element, 
          { opacity: 0, y: 80, rotationX: 45 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Luxury parallax effects
      gsap.utils.toArray('.parallax-bg').forEach((element: any) => {
        gsap.to(element, {
          yPercent: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      });

      // Premium stats counter with luxury timing
      gsap.utils.toArray('.stat-number').forEach((element: any) => {
        const endValue = parseFloat(element.getAttribute('data-value'));
        gsap.fromTo(element, 
          { textContent: 0 },
          {
            textContent: endValue,
            duration: 3,
            ease: 'power2.out',
            snap: { textContent: endValue % 1 === 0 ? 1 : 0.1 },
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Luxury card hover effects with 3D transforms
      gsap.utils.toArray('.luxury-card').forEach((card: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card, { 
          rotationY: 8, 
          rotationX: 8, 
          z: 100, 
          scale: 1.05,
          duration: 0.4, 
          ease: 'power2.out' 
        });

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
      });

      // Video scroll trigger
      ScrollTrigger.create({
        trigger: '.video-section',
        start: 'top 50%',
        onEnter: () => {
          if (heroVideoRef.current) {
            heroVideoRef.current.play();
          }
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    { 
      name: "Victoria Sterling", 
      role: "CEO", 
      company: "Platinum Enterprises", 
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", 
      content: "PLUDO.AI elevated our customer experience to unprecedented levels. The sophistication and intelligence of our AI agent has become our competitive advantage.",
      rating: 5,
      metrics: { roi: "+500%", satisfaction: "98%" }
    },
    { 
      name: "Alexander Crown", 
      role: "Founder", 
      company: "Crown Innovations", 
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", 
      content: "The level of customization and intelligence is extraordinary. Our conversion rates tripled within the first month of deployment.",
      rating: 5,
      metrics: { conversion: "+300%", engagement: "+450%" }
    },
    { 
      name: "Sophia Goldberg", 
      role: "VP Strategy", 
      company: "Elite Solutions", 
      avatar: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", 
      content: "PLUDO.AI doesn't just create AI agents—it crafts digital experiences that embody luxury and intelligence. Absolutely transformational.",
      rating: 5,
      metrics: { efficiency: "+400%", cost: "-60%" }
    }
  ];

  const pricingPlans = [
    {
      name: "Artisan",
      price: "Free",
      description: "Craft your first masterpiece",
      features: [
        "1 Premium AI Agent",
        "2,500 conversations/month",
        "Luxury customization",
        "Priority support",
        "Advanced AI models"
      ],
      cta: "Begin Journey",
      popular: false,
      accent: "gold"
    },
    {
      name: "Virtuoso",
      price: "$99",
      description: "For discerning professionals",
      features: [
        "10 Elite AI Agents",
        "50,000 conversations/month",
        "White-glove customization",
        "Concierge support",
        "Premium AI models",
        "Advanced analytics",
        "Custom branding",
        "Priority deployment"
      ],
      cta: "Elevate Experience",
      popular: true,
      accent: "platinum"
    },
    {
      name: "Sovereign",
      price: "Custom",
      description: "For visionary enterprises",
      features: [
        "Unlimited AI Agents",
        "Unlimited conversations",
        "Bespoke solutions",
        "Dedicated success team",
        "Custom AI training",
        "Enterprise analytics",
        "SLA guarantee",
        "Private cloud deployment",
        "24/7 white-glove support"
      ],
      cta: "Request Consultation",
      popular: false,
      accent: "gold"
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-dark text-white font-display" ref={containerRef}>
      <LuxuryParticles />
      
      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark-gray to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-transparent to-brand-dark/90" />
        
        {/* Luxury Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>
        
        {/* Floating Luxury Elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-brand-gold/20 to-brand-silver/20 rounded-full blur-3xl animate-scale-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-brand-silver/20 to-brand-platinum/20 rounded-full blur-3xl animate-scale-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-gradient-to-r from-brand-dark-gold/30 to-brand-gold/30 rounded-full blur-2xl animate-float" />
        
        <div className="relative z-10 text-center max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Luxury Hero Badge */}
          <div className="hero-badge inline-flex items-center space-x-4 bg-gradient-to-r from-brand-gold/10 to-brand-silver/10 backdrop-blur-2xl px-8 py-4 rounded-full border border-brand-gold/30 mb-12 shadow-2xl shadow-brand-gold/20">
            <Crown className="w-6 h-6 text-brand-gold animate-pulse" />
            <span className="text-brand-light-gold font-bold tracking-widest uppercase text-sm">The Pinnacle of AI Excellence</span>
            <Diamond className="w-6 h-6 text-brand-silver animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Cinematic Hero Title */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none">
              <span className="hero-title-word block">Craft</span>
              <span className="hero-title-word block bg-gradient-to-r from-brand-gold via-brand-light-gold to-brand-gold bg-300% bg-clip-text text-transparent animate-text-shimmer">Extraordinary</span>
              <span className="hero-title-word block">AI Agents</span>
            </h1>
          </div>

          {/* Luxury Subtitle */}
          <p className="hero-subtitle text-2xl md:text-3xl text-gray-200 max-w-5xl mx-auto font-light leading-relaxed mb-16 tracking-wide">
            Where artificial intelligence meets uncompromising luxury. Create, deploy, and scale 
            <span className="text-brand-gold font-medium"> sophisticated AI agents </span>
            that redefine customer excellence.
          </p>
          
          {/* Premium Action Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-8 mb-20">
            <Link to="/signup">
              <Button size="lg" className="px-16 py-8 text-2xl bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-black font-black shadow-2xl shadow-brand-gold/40 transform hover:scale-105 transition-all duration-300 border-2 border-brand-gold rounded-2xl">
                Begin Your Journey
                <ArrowRight className="w-8 h-8 ml-4" />
              </Button>
            </Link>
            <button 
              onClick={() => setVideoMuted(!videoMuted)}
              className="flex items-center text-2xl text-gray-200 hover:text-brand-gold transition-all duration-300 group"
            >
              <span className="mr-6 font-light tracking-wide">Experience Excellence</span>
              <div className="w-20 h-20 rounded-full border-2 border-brand-silver group-hover:border-brand-gold transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/5 group-hover:bg-brand-gold/10 shadow-xl">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </button>
          </div>

          {/* Luxury Statistics */}
          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {[
              { number: 100, suffix: "K+", label: "Elite Agents", color: "text-brand-gold" },
              { number: 99.99, suffix: "%", label: "Uptime", color: "text-brand-silver" },
              { number: 5, suffix: "M+", label: "Daily Interactions", color: "text-brand-platinum" },
              { number: 195, suffix: "", label: "Global Presence", color: "text-brand-light-gold" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-4xl md:text-5xl font-black mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <span className="stat-number" data-value={stat.number}>0</span>
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-gray-300 text-sm font-medium tracking-widest uppercase">{stat.label}</div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Luxury Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 animate-bounce">
          <span className="text-brand-light-gold text-xs uppercase tracking-widest font-medium">Discover Excellence</span>
          <div className="w-6 h-10 border-2 border-brand-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-brand-gold rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Premium Demo Section */}
      <section className="py-40 bg-gradient-to-b from-brand-dark to-black relative overflow-hidden">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-silver/5" />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Witness
              <span className="bg-gradient-to-r from-brand-gold to-brand-silver bg-clip-text text-transparent"> Perfection</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Experience the seamless fusion of artificial intelligence and luxury craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="fade-in-up">
              <PremiumDemo />
            </div>
            
            <div className="fade-in-up space-y-12">
              <h3 className="text-4xl font-black text-white mb-8 tracking-wide">
                From Vision to Reality
              </h3>
              
              <div className="space-y-8">
                {[
                  { 
                    icon: <Crown className="w-8 h-8" />, 
                    title: "Luxury Configuration", 
                    desc: "Bespoke design with meticulous attention to detail",
                    accent: "brand-gold"
                  },
                  { 
                    icon: <Brain className="w-8 h-8" />, 
                    title: "Elite Intelligence", 
                    desc: "Premium AI models with unparalleled sophistication",
                    accent: "brand-silver"
                  },
                  { 
                    icon: <Lightning className="w-8 h-8" />, 
                    title: "Instant Excellence", 
                    desc: "Deploy with the precision of Swiss craftsmanship",
                    accent: "brand-platinum"
                  },
                  { 
                    icon: <Globe className="w-8 h-8" />, 
                    title: "Global Mastery", 
                    desc: "Worldwide deployment with enterprise reliability",
                    accent: "brand-light-gold"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className={`flex-shrink-0 w-16 h-16 bg-${item.accent}/20 rounded-2xl flex items-center justify-center text-${item.accent} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">{item.title}</h4>
                      <p className="text-gray-300 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section with Scroll Trigger */}
      <section className="video-section py-40 bg-black relative overflow-hidden">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-brand-gold via-brand-silver to-brand-gold bg-clip-text text-transparent">
                Innovation in Motion
              </span>
            </h2>
          </div>
          
          <div className="fade-in-up relative rounded-3xl overflow-hidden border-2 border-brand-gold/30 shadow-2xl shadow-brand-gold/20">
            <video
              ref={heroVideoRef}
              muted={videoMuted}
              loop
              playsInline
              className="w-full h-auto"
              style={{ aspectRatio: '16/9' }}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <button
              onClick={() => setVideoMuted(!videoMuted)}
              className="absolute bottom-6 right-6 w-14 h-14 bg-brand-gold/20 backdrop-blur-md rounded-full flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-black transition-all duration-300"
            >
              {videoMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </section>

      {/* Premium Gallery Section */}
      <section className="py-40 bg-gradient-to-b from-black to-brand-dark relative overflow-hidden">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              Gallery of
              <span className="bg-gradient-to-r from-brand-gold to-brand-light-gold bg-clip-text text-transparent"> Excellence</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Explore the artistry of AI-powered customer experiences.
            </p>
          </div>
          
          <div className="fade-in-up">
            <PremiumGallery />
          </div>
        </div>
      </section>

      {/* Horizontal Features Section */}
      <section className="py-40 bg-brand-dark relative overflow-hidden">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              Engineered for
              <span className="bg-gradient-to-r from-brand-silver to-brand-platinum bg-clip-text text-transparent"> Perfection</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Every feature meticulously crafted to deliver unparalleled excellence.
            </p>
          </div>
          
          <div className="fade-in-up">
            <HorizontalFeatures />
          </div>
        </div>
      </section>

      {/* Device Compatibility Section */}
      <section className="py-40 bg-gradient-to-b from-brand-dark to-black relative overflow-hidden">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-l from-brand-gold/5 to-transparent" />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              Universal
              <span className="bg-gradient-to-r from-brand-gold to-brand-silver bg-clip-text text-transparent"> Mastery</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Flawless performance across every device, platform, and screen.
            </p>
          </div>

          <div className="fade-in-up mb-20">
            <DeviceShowcase />
          </div>

          <div className="text-center">
            <div className="fade-in-up inline-flex items-center space-x-12 bg-gradient-to-r from-brand-gold/10 to-brand-silver/10 backdrop-blur-xl px-12 py-6 rounded-3xl border border-brand-gold/30 shadow-2xl shadow-brand-gold/20">
              <div className="flex items-center space-x-3">
                <Check className="w-6 h-6 text-brand-gold" />
                <span className="text-gray-200 font-medium text-lg">Responsive Excellence</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-6 h-6 text-brand-silver" />
                <span className="text-gray-200 font-medium text-lg">Cross-Platform Mastery</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-6 h-6 text-brand-platinum" />
                <span className="text-gray-200 font-medium text-lg">Lightning Performance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 bg-brand-dark relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              Trusted by
              <span className="bg-gradient-to-r from-brand-gold to-brand-light-gold bg-clip-text text-transparent"> Visionaries</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Join the elite circle of businesses transforming their industries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="fade-in-up">
                <Card className="luxury-card p-10 h-full bg-gradient-to-br from-brand-dark-gray via-brand-dark to-black border border-brand-gold/30 rounded-3xl hover:border-brand-gold/60 transition-all duration-500 group shadow-2xl shadow-brand-gold/10 hover:shadow-brand-gold/30">
                  {/* Luxury Rating */}
                  <div className="flex mb-8">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-brand-gold fill-current" />
                    ))}
                  </div>
                  
                  {/* Premium Metrics */}
                  <div className="flex space-x-4 mb-8">
                    {Object.entries(testimonial.metrics).map(([key, value]) => (
                      <div key={key} className="bg-gradient-to-r from-brand-gold/20 to-brand-silver/20 px-4 py-2 rounded-full border border-brand-gold/30">
                        <span className="text-brand-gold font-bold text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Testimonial Quote */}
                  <blockquote className="text-gray-200 mb-10 italic text-xl leading-relaxed flex-grow group-hover:text-white transition-colors font-light">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Author with Luxury Styling */}
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-20 h-20 rounded-full mr-6 border-3 border-brand-gold/60 group-hover:border-brand-gold transition-colors shadow-lg" 
                    />
                    <div>
                      <div className="font-bold text-white text-xl mb-1">{testimonial.name}</div>
                      <div className="text-brand-gold font-semibold text-lg">{testimonial.role}</div>
                      <div className="text-gray-400 text-sm tracking-wide">{testimonial.company}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section className="py-40 bg-gradient-to-b from-brand-dark to-black relative overflow-hidden">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              Investment in
              <span className="bg-gradient-to-r from-brand-gold to-brand-silver bg-clip-text text-transparent"> Excellence</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Choose your path to AI supremacy with transparent, value-driven pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="fade-in-up">
                <Card className={`luxury-card p-10 h-full rounded-3xl transition-all duration-500 transform hover:-translate-y-4 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-brand-gold/20 via-brand-gold/10 to-brand-silver/20 border-2 border-brand-gold scale-105 shadow-2xl shadow-brand-gold/30' 
                    : 'bg-gradient-to-br from-brand-dark-gray via-brand-dark to-black border border-brand-light-gray/30 hover:border-brand-gold/50 shadow-xl shadow-brand-gold/10'
                }`}>

                  {plan.popular && (
                    <div className="text-center mb-6">
                      <span className="bg-gradient-to-r from-brand-gold to-brand-light-gold text-black px-6 py-2 rounded-full text-sm font-black uppercase tracking-wider shadow-lg">
                        Most Prestigious
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-black text-white mb-4 tracking-wide">{plan.name}</h3>
                    <div className="text-5xl font-black text-white mb-4">
                      {plan.price}
                      {plan.price !== 'Free' && plan.price !== 'Custom' && (
                        <span className="text-xl text-gray-400 font-normal">/month</span>
                      )}
                    </div>
                    <p className="text-gray-300 text-lg font-light">{plan.description}</p>
                  </div>

                  <ul className="space-y-6 mb-12">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-6 h-6 text-brand-gold mr-4 flex-shrink-0" />
                        <span className="text-gray-200 text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-6 text-xl font-black transition-all duration-300 rounded-2xl ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-black shadow-2xl shadow-brand-gold/40'
                        : 'bg-gradient-to-r from-brand-dark-gray to-brand-light-gray hover:from-brand-light-gray hover:to-brand-dark-gray text-white border-2 border-brand-gold/30 hover:border-brand-gold shadow-xl'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Luxury CTA Section */}
      <section className="py-40 relative overflow-hidden bg-gradient-to-t from-brand-gold/20 via-brand-dark to-brand-dark">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-brand-dark/50 to-brand-dark" />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-16">
            <div className="fade-in-up">
              <h2 className="text-6xl md:text-8xl font-black leading-tight mb-8 tracking-tight">
                Ready to Transcend
                <br />
                <span className="bg-gradient-to-r from-brand-gold via-brand-light-gold to-brand-gold bg-300% bg-clip-text text-transparent animate-text-shimmer">
                  Excellence?
                </span>
              </h2>
            </div>
            
            <p className="fade-in-up text-3xl text-gray-200 max-w-5xl mx-auto leading-relaxed font-light tracking-wide">
              Join the elite circle of visionary businesses already transforming their industries with AI excellence.
            </p>
            
            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-12">
              <Link to="/signup">
                <Button size="lg" className="px-20 py-10 text-3xl bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-black font-black shadow-2xl shadow-brand-gold/50 transform hover:scale-105 transition-all duration-300 border-2 border-brand-gold rounded-2xl">
                  Begin Your Legacy
                  <ArrowRight className="w-10 h-10 ml-6" />
                </Button>
              </Link>
              
              <Link to="/create">
                <Button size="lg" variant="outline" className="px-20 py-10 text-3xl border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-black transition-all duration-300 rounded-2xl shadow-xl">
                  Experience Demo
                  <Eye className="w-10 h-10 ml-6" />
                </Button>
              </Link>
            </div>
            
            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-16 text-gray-300 text-xl font-medium">
              <div className="flex items-center">
                <Crown className="w-8 h-8 mr-4 text-brand-gold" />
                Premium forever plan
              </div>
              <div className="flex items-center">
                <Shield className="w-8 h-8 mr-4 text-brand-silver" />
                No commitment required
              </div>
              <div className="flex items-center">
                <Lightning className="w-8 h-8 mr-4 text-brand-platinum" />
                Deploy in 60 seconds
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};