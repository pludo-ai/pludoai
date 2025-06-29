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
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import { useThemeStore } from '../store/themeStore';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Enhanced Interactive Demo Component with Theme Support
const PremiumDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { isDark } = useThemeStore();
  
  const demoSteps = [
    { 
      title: "Luxury Design Studio", 
      description: "Craft your agent's premium appearance with bespoke tools.",
      icon: <Crown className="w-5 h-5" />,
      color: isDark ? "from-yellow-500 to-yellow-400" : "from-gray-800 to-gray-700"
    },
    { 
      title: "Elite AI Intelligence", 
      description: "Select from exclusive, high-performance AI models.",
      icon: <Brain className="w-5 h-5" />,
      color: isDark ? "from-gray-400 to-gray-300" : "from-gray-600 to-gray-500"
    },
    { 
      title: "Instantaneous Deployment", 
      description: "Launch with enterprise-grade precision and speed.",
      icon: <Rocket className="w-5 h-5" />,
      color: isDark ? "from-white to-gray-200" : "from-gray-900 to-gray-800"
    },
    { 
      title: "Global Platform Reach", 
      description: "Embed seamlessly across all digital touchpoints.",
      icon: <Globe className="w-5 h-5" />,
      color: isDark ? "from-yellow-600 to-yellow-500" : "from-gray-700 to-gray-600"
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
    <div className={`relative rounded-2xl p-6 md:p-8 border shadow-2xl overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-black border-yellow-500/30 shadow-yellow-500/20' 
        : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 border-gray-300/50 shadow-gray-400/20'
    }`}>
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute inset-0 animate-gradient bg-300% ${
          isDark 
            ? 'bg-gradient-to-r from-yellow-500 via-transparent to-gray-400' 
            : 'bg-gradient-to-r from-gray-800 via-transparent to-gray-600'
        }`} />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-yellow-500' : 'bg-gray-800'
            }`} />
            <h3 className={`text-xl md:text-2xl font-bold tracking-wide ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Live Demonstration</h3>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-gray-400' : 'bg-gray-600'
            }`} style={{ animationDelay: '0.5s' }} />
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm ${
              isDark 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 shadow-yellow-500/30' 
                : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-700 hover:to-gray-600 shadow-gray-800/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {demoSteps.map((step, index) => (
            <div
              key={index}
              className={`relative p-4 md:p-6 rounded-xl transition-all duration-700 transform ${
                currentStep === index
                  ? isDark 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-gray-400/20 border border-yellow-500/60 scale-105 shadow-xl shadow-yellow-500/20'
                    : 'bg-gradient-to-r from-gray-800/20 to-gray-600/20 border border-gray-800/60 scale-105 shadow-xl shadow-gray-800/20'
                  : isDark
                    ? 'bg-gray-800/20 border border-gray-700/30 hover:border-gray-400/50'
                    : 'bg-gray-100/50 border border-gray-300/30 hover:border-gray-500/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all duration-500 ${
                  currentStep === index 
                    ? `bg-gradient-to-r ${step.color} shadow-lg ${isDark ? 'text-black' : 'text-white'}` 
                    : isDark 
                      ? 'bg-gray-700/50 text-gray-400'
                      : 'bg-gray-200/50 text-gray-600'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-base md:text-lg transition-colors duration-500 ${
                    currentStep === index 
                      ? isDark ? 'text-yellow-400' : 'text-gray-800'
                      : isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm transition-colors duration-500 ${
                    currentStep === index 
                      ? isDark ? 'text-gray-200' : 'text-gray-700'
                      : isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {currentStep === index && (
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    isDark ? 'bg-yellow-500' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Horizontal Scrolling Features Component with Theme Support
const HorizontalFeatures: React.FC = () => {
  const { isDark } = useThemeStore();
  
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Neural Intelligence",
      description: "Advanced AI models with human-like reasoning capabilities",
      gradient: "from-purple-600 to-pink-600",
      stats: "99.9% Accuracy"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Fort Knox Security",
      description: "Military-grade encryption and enterprise compliance",
      gradient: "from-green-600 to-emerald-600",
      stats: "SOC 2 Certified"
    },
    {
      icon: <Lightning className="w-8 h-8" />,
      title: "Lightning Deploy",
      description: "From concept to production in under 60 seconds",
      gradient: "from-yellow-600 to-orange-600",
      stats: "< 60 Seconds"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Scale",
      description: "Worldwide CDN with 99.99% uptime guarantee",
      gradient: "from-blue-600 to-cyan-600",
      stats: "150+ Countries"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Infinite Customization",
      description: "Complete brand control with pixel-perfect precision",
      gradient: "from-indigo-600 to-purple-600",
      stats: "Unlimited Themes"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Deep Analytics",
      description: "Real-time insights with predictive intelligence",
      gradient: "from-red-600 to-pink-600",
      stats: "Real-time Data"
    }
  ];

  return (
    <div className="relative overflow-hidden py-6">
      <div className="flex space-x-6 animate-slide-right">
        {[...features, ...features].map((feature, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-80 p-6 rounded-2xl border shadow-2xl group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
              isDark 
                ? 'bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-yellow-500/30 shadow-yellow-500/10 hover:shadow-yellow-500/30'
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-300/50 shadow-gray-400/10 hover:shadow-gray-400/30'
            }`}
          >
            <div className="mb-4">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-20 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white">{feature.icon}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xl font-bold transition-colors ${
                  isDark 
                    ? 'text-white group-hover:text-yellow-400'
                    : 'text-gray-900 group-hover:text-gray-700'
                }`}>
                  {feature.title}
                </h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  isDark 
                    ? 'text-yellow-400 bg-yellow-500/20'
                    : 'text-gray-800 bg-gray-200'
                }`}>
                  {feature.stats}
                </span>
              </div>
              <p className={`leading-relaxed transition-colors text-sm ${
                isDark 
                  ? 'text-gray-300 group-hover:text-gray-200'
                  : 'text-gray-600 group-hover:text-gray-700'
              }`}>
                {feature.description}
              </p>
            </div>
            <div className={`w-full h-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity ${
              isDark 
                ? 'bg-gradient-to-r from-yellow-500 to-gray-400'
                : 'bg-gradient-to-r from-gray-800 to-gray-600'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const { isDark } = useThemeStore();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Advanced scroll-triggered animations
      gsap.utils.toArray('.fade-in-up').forEach((elem: any) => {
        gsap.from(elem, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Parallax backgrounds
      gsap.utils.toArray('.parallax-bg').forEach((elem: any) => {
        gsap.to(elem, {
          backgroundPosition: `50% ${-window.innerHeight / 2}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: elem,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      // Premium stats counter
      gsap.utils.toArray('.stat-number').forEach((elem: any) => {
        gsap.from(elem, {
          textContent: 0,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: elem,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Video scroll trigger
      ScrollTrigger.create({
        trigger: '.video-section',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => heroVideoRef.current?.play(),
        onLeaveBack: () => heroVideoRef.current?.pause(),
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    { 
      name: "Victoria Sterling", 
      role: "CEO, Platinum Enterprises", 
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", 
      content: "PLUDO.AI elevated our customer experience to unprecedented levels. The sophistication and intelligence of our AI agent has become our competitive advantage.",
      rating: 5,
      metrics: { roi: "+500%", satisfaction: "98%" }
    },
    { 
      name: "Alexander Crown", 
      role: "Founder, Crown Innovations", 
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", 
      content: "The level of customization and intelligence is extraordinary. Our conversion rates tripled within the first month of deployment.",
      rating: 5,
      metrics: { conversion: "+300%", engagement: "+450%" }
    },
    { 
      name: "Sophia Goldberg", 
      role: "VP Strategy, Elite Solutions", 
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
      description: "Begin your journey into AI excellence.",
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
      description: "For discerning professionals who demand more.",
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
      cta: "Elevate Your Experience",
      popular: true,
      accent: "platinum"
    },
    {
      name: "Sovereign",
      price: "Custom",
      description: "For visionary enterprises building the future.",
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
    <div className={`min-h-screen overflow-x-hidden font-display transition-colors duration-300 ${
      isDark ? 'bg-[#0A0A0A] text-white' : 'bg-white text-gray-900'
    }`} ref={containerRef}>
      
      {/* New Geometric Hero Section */}
      <HeroGeometric
        badge="The Pinnacle of AI Excellence"
        title1="Craft Extraordinary"
        title2="AI Agents"
        description="Where artificial intelligence meets uncompromising luxury. Create, deploy, and scale sophisticated AI agents that redefine customer excellence."
      />

      {/* Premium Demo Section */}
      <section id="demo" className={`py-20 md:py-32 relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-b from-[#0A0A0A] to-black' 
          : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className={`parallax-bg absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-r from-yellow-500/5 via-transparent to-gray-400/5' 
            : 'bg-gradient-to-r from-gray-800/5 via-transparent to-gray-600/5'
        }`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="fade-in-up text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              Witness
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-yellow-400 to-gray-300' 
                  : 'from-gray-800 to-gray-600'
              }`}> Perfection</span>
            </h2>
            <p className={`fade-in-up text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Experience the seamless fusion of artificial intelligence and luxury craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="fade-in-up">
              <PremiumDemo />
            </div>
            
            <div className="fade-in-up space-y-8">
              <h3 className={`text-2xl md:text-3xl font-black mb-6 tracking-wide ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                From Vision to Reality, Instantly
              </h3>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: <Crown className="w-6 h-6" />, 
                    title: "Luxury Configuration", 
                    desc: "Bespoke design with meticulous attention to detail.",
                    accent: isDark ? "yellow-400" : "gray-800"
                  },
                  { 
                    icon: <Brain className="w-6 h-6" />, 
                    title: "Elite Intelligence", 
                    desc: "Access premium AI models with unparalleled sophistication.",
                    accent: isDark ? "gray-400" : "gray-600"
                  },
                  { 
                    icon: <Lightning className="w-6 h-6" />, 
                    title: "Instant Excellence", 
                    desc: "Deploy with the precision of Swiss craftsmanship.",
                    accent: isDark ? "white" : "gray-900"
                  },
                  { 
                    icon: <Globe className="w-6 h-6" />, 
                    title: "Global Mastery", 
                    desc: "Worldwide deployment with enterprise reliability.",
                    accent: isDark ? "yellow-500" : "gray-700"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${
                      isDark 
                        ? `bg-${item.accent}/20 text-${item.accent}`
                        : `bg-${item.accent}/10 text-${item.accent}`
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className={`text-lg md:text-xl font-bold mb-1 transition-colors ${
                        isDark 
                          ? 'text-white group-hover:text-yellow-400'
                          : 'text-gray-900 group-hover:text-gray-700'
                      }`}>{item.title}</h4>
                      <p className={`leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section with Scroll Trigger */}
      <section className={`video-section py-20 md:py-32 relative overflow-hidden ${
        isDark ? 'bg-black' : 'bg-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="fade-in-up text-3xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-yellow-400 via-gray-300 to-yellow-400' 
                  : 'from-gray-800 via-gray-600 to-gray-800'
              }`}>
                Innovation in Motion
              </span>
            </h2>
          </div>
          
          <div className={`fade-in-up relative rounded-2xl overflow-hidden border-2 shadow-2xl ${
            isDark 
              ? 'border-yellow-500/30 shadow-yellow-500/20' 
              : 'border-gray-300/50 shadow-gray-400/20'
          }`}>
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
            <div className={`absolute inset-0 pointer-events-none ${
              isDark 
                ? 'bg-gradient-to-t from-black/50 via-transparent to-transparent' 
                : 'bg-gradient-to-t from-white/50 via-transparent to-transparent'
            }`} />
            <button
              onClick={() => setVideoMuted(!videoMuted)}
              className={`absolute bottom-4 right-4 w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 ${
                isDark 
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black'
                  : 'bg-gray-800/20 text-gray-800 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {videoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </section>

      {/* Horizontal Features Section */}
      <section className={`py-20 md:py-32 relative overflow-hidden ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="fade-in-up text-3xl md:text-5xl lg:text-6xl font-black mb-6">
              Engineered for
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-gray-300 to-white' 
                  : 'from-gray-700 to-gray-900'
              }`}> Perfection</span>
            </h2>
            <p className={`fade-in-up text-lg md:text-xl max-w-3xl mx-auto font-light ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Every feature is meticulously crafted to deliver unparalleled excellence.
            </p>
          </div>
          
          <div className="fade-in-up">
            <HorizontalFeatures />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 md:py-32 relative ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="fade-in-up text-3xl md:text-5xl lg:text-6xl font-black mb-6">
              Trusted by
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-yellow-400 to-yellow-500' 
                  : 'from-gray-800 to-gray-700'
              }`}> Visionaries</span>
            </h2>
            <p className={`fade-in-up text-lg md:text-xl max-w-3xl mx-auto font-light ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join the elite circle of businesses transforming their industries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="fade-in-up">
                <Card className={`p-6 md:p-8 h-full rounded-2xl transition-all duration-500 group shadow-2xl ${
                  isDark 
                    ? 'bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-black border border-yellow-500/30 hover:border-yellow-500/60 shadow-yellow-500/10 hover:shadow-yellow-500/30'
                    : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-300/50 hover:border-gray-400/60 shadow-gray-400/10 hover:shadow-gray-400/30'
                }`}>
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 fill-current ${
                        isDark ? 'text-yellow-400' : 'text-gray-800'
                      }`} />
                    ))}
                  </div>
                  
                  <div className="flex space-x-3 mb-6">
                    {Object.entries(testimonial.metrics).map(([key, value]) => (
                      <div key={key} className={`px-3 py-1 rounded-full border ${
                        isDark 
                          ? 'bg-gradient-to-r from-yellow-500/20 to-gray-400/20 border-yellow-500/30'
                          : 'bg-gradient-to-r from-gray-800/20 to-gray-600/20 border-gray-300/50'
                      }`}>
                        <span className={`font-bold text-xs ${
                          isDark ? 'text-yellow-400' : 'text-gray-800'
                        }`}>{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <blockquote className={`mb-8 italic text-lg leading-relaxed flex-grow transition-colors font-light ${
                    isDark 
                      ? 'text-gray-200 group-hover:text-white'
                      : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className={`w-16 h-16 rounded-full mr-4 border-2 transition-colors shadow-lg ${
                        isDark 
                          ? 'border-yellow-500/60 group-hover:border-yellow-500'
                          : 'border-gray-300/60 group-hover:border-gray-400'
                      }`} 
                    />
                    <div>
                      <div className={`font-bold text-lg mb-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{testimonial.name}</div>
                      <div className={`font-semibold ${
                        isDark ? 'text-yellow-400' : 'text-gray-700'
                      }`}>{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section className={`py-20 md:py-32 relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-b from-[#0A0A0A] to-black' 
          : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className={`parallax-bg absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' 
            : 'bg-gradient-to-r from-gray-800/5 to-transparent'
        }`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="fade-in-up text-3xl md:text-5xl lg:text-6xl font-black mb-6">
              An Investment in
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-yellow-400 to-gray-300' 
                  : 'from-gray-800 to-gray-600'
              }`}> Supremacy</span>
            </h2>
            <p className={`fade-in-up text-lg md:text-xl max-w-3xl mx-auto font-light ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Choose your path to AI leadership with transparent, value-driven pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="fade-in-up">
                <Card className={`p-6 md:p-8 h-full rounded-2xl transition-all duration-500 transform ${
                  plan.popular 
                    ? isDark
                      ? 'bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-gray-400/20 border-2 border-yellow-500 scale-105 shadow-2xl shadow-yellow-500/30'
                      : 'bg-gradient-to-br from-gray-800/20 via-gray-800/10 to-gray-600/20 border-2 border-gray-800 scale-105 shadow-2xl shadow-gray-800/30'
                    : isDark
                      ? 'bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-black border border-gray-700/30 hover:border-yellow-500/50 shadow-xl shadow-yellow-500/10'
                      : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-300/30 hover:border-gray-500/50 shadow-xl shadow-gray-400/10'
                }`}>

                  {plan.popular && (
                    <div className="text-center mb-4">
                      <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${
                        isDark 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black'
                          : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white'
                      }`}>
                        Most Prestigious
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-black mb-3 tracking-wide ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{plan.name}</h3>
                    <div className={`text-4xl font-black mb-3 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.price}
                      {plan.price !== 'Free' && plan.price !== 'Custom' && (
                        <span className={`text-lg font-normal ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>/month</span>
                      )}
                    </div>
                    <p className={`font-light ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${
                          isDark ? 'text-yellow-400' : 'text-gray-800'
                        }`} />
                        <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-4 text-lg font-black transition-all duration-300 rounded-xl ${
                      plan.popular
                        ? isDark
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black shadow-2xl shadow-yellow-500/40'
                          : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-2xl shadow-gray-800/40'
                        : isDark
                          ? 'bg-gradient-to-r from-[#1A1A1A] to-gray-700 hover:from-gray-700 hover:to-[#1A1A1A] text-white border-2 border-yellow-500/30 hover:border-yellow-500 shadow-xl'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 border-2 border-gray-300/50 hover:border-gray-400 shadow-xl'
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
      <section className={`py-20 md:py-32 relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-t from-yellow-500/20 via-[#0A0A0A] to-[#0A0A0A]'
          : 'bg-gradient-to-t from-gray-800/20 via-white to-white'
      }`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-50" />
        <div className={`absolute top-0 left-0 w-full h-full ${
          isDark 
            ? 'bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]'
            : 'bg-gradient-to-b from-transparent via-white/50 to-white'
        }`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-12">
            <div className="fade-in-up">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
                Ready to Transcend
                <br />
                <span className={`bg-gradient-to-r bg-200% bg-clip-text text-transparent animate-text-shimmer ${
                  isDark 
                    ? 'from-yellow-400 via-yellow-500 to-yellow-400'
                    : 'from-gray-800 via-gray-700 to-gray-800'
                }`}>
                  Excellence?
                </span>
              </h2>
            </div>
            
            <p className={`fade-in-up text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light tracking-wide ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Join the elite circle of visionary businesses already transforming their industries with AI excellence.
            </p>
            
            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <Link to="/signup">
                <Button size="lg" className={`px-12 py-6 text-xl font-black shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 rounded-xl ${
                  isDark 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black shadow-yellow-500/50 border-yellow-500'
                    : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-gray-800/50 border-gray-800'
                }`}>
                  Begin Your Legacy
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              
              <Link to="/create">
                <Button size="lg" variant="outline" className={`px-12 py-6 text-xl font-black transition-all duration-300 rounded-xl shadow-xl border-2 ${
                  isDark 
                    ? 'border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black'
                    : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
                }`}>
                  Experience Demo
                  <Eye className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
            
            <div className={`fade-in-up flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-lg font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div className="flex items-center">
                <Crown className={`w-6 h-6 mr-3 ${
                  isDark ? 'text-yellow-400' : 'text-gray-800'
                }`} />
                Premium forever plan
              </div>
              <div className="flex items-center">
                <Shield className={`w-6 h-6 mr-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                No commitment required
              </div>
              <div className="flex items-center">
                <Lightning className={`w-6 h-6 mr-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`} />
                Deploy in 60 seconds
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};