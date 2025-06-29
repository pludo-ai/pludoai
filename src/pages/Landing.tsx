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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Enhanced Interactive Demo Component with New Style
const PremiumDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  const demoSteps = [
    { 
      title: "Luxury Design Studio", 
      description: "Craft your agent's premium appearance with bespoke tools.",
      icon: <Crown className="w-6 h-6" />,
      color: "from-yellow-500 to-yellow-400"
    },
    { 
      title: "Elite AI Intelligence", 
      description: "Select from exclusive, high-performance AI models.",
      icon: <Brain className="w-6 h-6" />,
      color: "from-gray-400 to-gray-300"
    },
    { 
      title: "Instantaneous Deployment", 
      description: "Launch with enterprise-grade precision and speed.",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-white to-gray-200"
    },
    { 
      title: "Global Platform Reach", 
      description: "Embed seamlessly across all digital touchpoints.",
      icon: <Globe className="w-6 h-6" />,
      color: "from-yellow-600 to-yellow-500"
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
    <div className="relative bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-black rounded-3xl p-8 border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 overflow-hidden">
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-transparent to-gray-400 animate-gradient bg-300%" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <h3 className="text-2xl font-bold text-white tracking-wide">Live Demonstration</h3>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black rounded-full font-bold hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/30"
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
                  ? 'bg-gradient-to-r from-yellow-500/20 to-gray-400/20 border border-yellow-500/60 scale-105 shadow-xl shadow-yellow-500/20'
                  : 'bg-gray-800/20 border border-gray-700/30 hover:border-gray-400/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-500 ${
                  currentStep === index 
                    ? `bg-gradient-to-r ${step.color} text-black shadow-lg` 
                    : 'bg-gray-700/50 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-lg transition-colors duration-500 ${
                    currentStep === index ? 'text-yellow-400' : 'text-white'
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
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Horizontal Scrolling Features Component with New Style
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
            className="flex-shrink-0 w-96 p-8 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-3xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/10 group hover:shadow-yellow-500/30 transition-all duration-500 transform hover:scale-105"
          >
            <div className="mb-6">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} bg-opacity-20 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white">{feature.icon}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <span className="text-yellow-400 text-sm font-bold bg-yellow-500/20 px-3 py-1 rounded-full">
                  {feature.stats}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                {feature.description}
              </p>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-yellow-500 to-gray-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Advanced scroll-triggered animations
      gsap.utils.toArray('.fade-in-up').forEach((elem: any) => {
        gsap.from(elem, {
          opacity: 0,
          y: 100,
          duration: 1.2,
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
          duration: 3,
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
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-white font-display" ref={containerRef}>
      
      {/* New Geometric Hero Section */}
      <HeroGeometric
        badge="The Pinnacle of AI Excellence"
        title1="Craft Extraordinary"
        title2="AI Agents"
        description="Where artificial intelligence meets uncompromising luxury. Create, deploy, and scale sophisticated AI agents that redefine customer excellence."
      />

      {/* Premium Demo Section */}
      <section id="demo" className="py-40 bg-gradient-to-b from-[#0A0A0A] to-black relative overflow-hidden">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-gray-400/5" />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Witness
              <span className="bg-gradient-to-r from-yellow-400 to-gray-300 bg-clip-text text-transparent"> Perfection</span>
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
                From Vision to Reality, Instantly
              </h3>
              
              <div className="space-y-8">
                {[
                  { 
                    icon: <Crown className="w-8 h-8" />, 
                    title: "Luxury Configuration", 
                    desc: "Bespoke design with meticulous attention to detail.",
                    accent: "yellow-400"
                  },
                  { 
                    icon: <Brain className="w-8 h-8" />, 
                    title: "Elite Intelligence", 
                    desc: "Access premium AI models with unparalleled sophistication.",
                    accent: "gray-400"
                  },
                  { 
                    icon: <Lightning className="w-8 h-8" />, 
                    title: "Instant Excellence", 
                    desc: "Deploy with the precision of Swiss craftsmanship.",
                    accent: "white"
                  },
                  { 
                    icon: <Globe className="w-8 h-8" />, 
                    title: "Global Mastery", 
                    desc: "Worldwide deployment with enterprise reliability.",
                    accent: "yellow-500"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className={`flex-shrink-0 w-16 h-16 bg-${item.accent}/20 rounded-2xl flex items-center justify-center text-${item.accent} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{item.title}</h4>
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
              <span className="bg-gradient-to-r from-yellow-400 via-gray-300 to-yellow-400 bg-clip-text text-transparent">
                Innovation in Motion
              </span>
            </h2>
          </div>
          
          <div className="fade-in-up relative rounded-3xl overflow-hidden border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
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
              className="absolute bottom-6 right-6 w-14 h-14 bg-yellow-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              {videoMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </section>

      {/* Horizontal Features Section */}
      <section className="py-40 bg-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              Engineered for
              <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent"> Perfection</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Every feature is meticulously crafted to deliver unparalleled excellence.
            </p>
          </div>
          
          <div className="fade-in-up">
            <HorizontalFeatures />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 bg-[#0A0A0A] relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              Trusted by
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent"> Visionaries</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Join the elite circle of businesses transforming their industries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="fade-in-up">
                <Card className="p-10 h-full bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-black border border-yellow-500/30 rounded-3xl hover:border-yellow-500/60 transition-all duration-500 group shadow-2xl shadow-yellow-500/10 hover:shadow-yellow-500/30">
                  <div className="flex mb-8">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div className="flex space-x-4 mb-8">
                    {Object.entries(testimonial.metrics).map(([key, value]) => (
                      <div key={key} className="bg-gradient-to-r from-yellow-500/20 to-gray-400/20 px-4 py-2 rounded-full border border-yellow-500/30">
                        <span className="text-yellow-400 font-bold text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-200 mb-10 italic text-xl leading-relaxed flex-grow group-hover:text-white transition-colors font-light">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-20 h-20 rounded-full mr-6 border-3 border-yellow-500/60 group-hover:border-yellow-500 transition-colors shadow-lg" 
                    />
                    <div>
                      <div className="font-bold text-white text-xl mb-1">{testimonial.name}</div>
                      <div className="text-yellow-400 font-semibold text-lg">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section className="py-40 bg-gradient-to-b from-[#0A0A0A] to-black relative overflow-hidden">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent" />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="fade-in-up text-5xl md:text-7xl font-black mb-8">
              An Investment in
              <span className="bg-gradient-to-r from-yellow-400 to-gray-300 bg-clip-text text-transparent"> Supremacy</span>
            </h2>
            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Choose your path to AI leadership with transparent, value-driven pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="fade-in-up">
                <Card className={`p-10 h-full rounded-3xl transition-all duration-500 transform ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-gray-400/20 border-2 border-yellow-500 scale-105 shadow-2xl shadow-yellow-500/30' 
                    : 'bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-black border border-gray-700/30 hover:border-yellow-500/50 shadow-xl shadow-yellow-500/10'
                }`}>

                  {plan.popular && (
                    <div className="text-center mb-6">
                      <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-2 rounded-full text-sm font-black uppercase tracking-wider shadow-lg">
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
                        <Check className="w-6 h-6 text-yellow-400 mr-4 flex-shrink-0" />
                        <span className="text-gray-200 text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-6 text-xl font-black transition-all duration-300 rounded-2xl ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black shadow-2xl shadow-yellow-500/40'
                        : 'bg-gradient-to-r from-[#1A1A1A] to-gray-700 hover:from-gray-700 hover:to-[#1A1A1A] text-white border-2 border-yellow-500/30 hover:border-yellow-500 shadow-xl'
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
      <section className="py-40 relative overflow-hidden bg-gradient-to-t from-yellow-500/20 via-[#0A0A0A] to-[#0A0A0A]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-16">
            <div className="fade-in-up">
              <h2 className="text-6xl md:text-8xl font-black leading-tight mb-8 tracking-tight">
                Ready to Transcend
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-200% bg-clip-text text-transparent animate-text-shimmer">
                  Excellence?
                </span>
              </h2>
            </div>
            
            <p className="fade-in-up text-3xl text-gray-200 max-w-5xl mx-auto leading-relaxed font-light tracking-wide">
              Join the elite circle of visionary businesses already transforming their industries with AI excellence.
            </p>
            
            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-12">
              <Link to="/signup">
                <Button size="lg" className="px-20 py-10 text-3xl bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-black shadow-2xl shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 border-2 border-yellow-500 rounded-2xl">
                  Begin Your Legacy
                  <ArrowRight className="w-10 h-10 ml-6" />
                </Button>
              </Link>
              
              <Link to="/create">
                <Button size="lg" variant="outline" className="px-20 py-10 text-3xl border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black font-black transition-all duration-300 rounded-2xl shadow-xl">
                  Experience Demo
                  <Eye className="w-10 h-10 ml-6" />
                </Button>
              </Link>
            </div>
            
            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-16 text-gray-300 text-xl font-medium">
              <div className="flex items-center">
                <Crown className="w-8 h-8 mr-4 text-yellow-400" />
                Premium forever plan
              </div>
              <div className="flex items-center">
                <Shield className="w-8 h-8 mr-4 text-gray-400" />
                No commitment required
              </div>
              <div className="flex items-center">
                <Lightning className="w-8 h-8 mr-4 text-white" />
                Deploy in 60 seconds
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};