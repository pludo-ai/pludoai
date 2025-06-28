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

  Tablet

} from 'lucide-react';

import { Button } from '../components/ui/Button';

import { Card } from '../components/ui/Card';



// Register GSAP plugins

gsap.registerPlugin(ScrollTrigger, TextPlugin);



// Floating Particles Component

const FloatingParticles: React.FC = () => {

  const particlesRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    const particles = particlesRef.current?.children;

    if (!particles) return;



    Array.from(particles).forEach((particle, index) => {

      gsap.set(particle, {

        x: Math.random() * window.innerWidth,

        y: Math.random() * window.innerHeight,

        scale: Math.random() * 0.5 + 0.5,

        opacity: Math.random() * 0.3 + 0.1

      });



      gsap.to(particle, {

        y: '-=100',

        x: `+=${Math.random() * 200 - 100}`,

        duration: Math.random() * 20 + 10,

        repeat: -1,

        yoyo: true,

        ease: 'none'

      });

    });

  }, []);



  return (

    <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-0">

      {Array.from({ length: 50 }).map((_, i) => (

        <div

          key={i}

          className="absolute w-1 h-1 bg-brand-gold rounded-full opacity-20"

        />

      ))}

    </div>

  );

};



// Interactive Demo Component

const InteractiveDemo: React.FC = () => {

  const [isPlaying, setIsPlaying] = React.useState(false);

  const [currentStep, setCurrentStep] = React.useState(0);

  

  const demoSteps = [

    { title: "Design Your Agent", description: "Customize appearance and personality" },

    { title: "Configure AI", description: "Choose your preferred AI model" },

    { title: "Deploy Instantly", description: "Go live in seconds" },

    { title: "Embed Anywhere", description: "Add to any website with one line" }

  ];



  useEffect(() => {

    if (isPlaying) {

      const interval = setInterval(() => {

        setCurrentStep((prev) => (prev + 1) % demoSteps.length);

      }, 2000);

      return () => clearInterval(interval);

    }

  }, [isPlaying, demoSteps.length]);



  return (

    <div className="relative bg-gradient-to-br from-brand-gray to-black rounded-3xl p-8 border border-brand-gold/20">

      <div className="flex items-center justify-between mb-6">

        <h3 className="text-2xl font-bold text-white">Live Demo</h3>

        <button

          onClick={() => setIsPlaying(!isPlaying)}

          className="flex items-center space-x-2 px-4 py-2 bg-brand-gold text-black rounded-full font-medium hover:bg-brand-light-gold transition-colors"

        >

          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}

          <span>{isPlaying ? 'Pause' : 'Play'}</span>

        </button>

      </div>

      

      <div className="space-y-4">

        {demoSteps.map((step, index) => (

          <div

            key={index}

            className={`p-4 rounded-xl transition-all duration-500 ${

              currentStep === index

                ? 'bg-brand-gold/20 border border-brand-gold/50 scale-105'

                : 'bg-brand-light-gray/30 border border-transparent'

            }`}

          >

            <div className="flex items-center space-x-3">

              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${

                currentStep === index ? 'bg-brand-gold text-black' : 'bg-brand-light-gray text-gray-400'

              }`}>

                {index + 1}

              </div>

              <div>

                <h4 className="font-semibold text-white">{step.title}</h4>

                <p className="text-sm text-gray-400">{step.description}</p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};



// Device Mockup Component

const DeviceMockup: React.FC<{ type: 'desktop' | 'tablet' | 'mobile' }> = ({ type }) => {

  const getIcon = () => {

    switch (type) {

      case 'desktop': return <Monitor className="w-6 h-6" />;

      case 'tablet': return <Tablet className="w-6 h-6" />;

      case 'mobile': return <Smartphone className="w-6 h-6" />;

    }

  };



  const getSize = () => {

    switch (type) {

      case 'desktop': return 'w-full h-64';

      case 'tablet': return 'w-48 h-36';

      case 'mobile': return 'w-24 h-40';

    }

  };



  return (

    <div className="text-center space-y-4">

      <div className={`${getSize()} bg-gradient-to-br from-brand-gray to-black rounded-2xl border border-brand-gold/30 p-4 relative overflow-hidden`}>

        <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/10 to-transparent" />

        <div className="relative z-10 h-full flex items-center justify-center">

          <div className="text-brand-gold">{getIcon()}</div>

        </div>

        <div className="absolute bottom-4 right-4 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center">

          <Bot className="w-6 h-6 text-black" />

        </div>

      </div>

      <p className="text-sm text-gray-400 capitalize">{type}</p>

    </div>

  );

};



export const Landing: React.FC = () => {

  const containerRef = useRef<HTMLDivElement>(null);

  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const [videoMuted, setVideoMuted] = React.useState(true);



  useEffect(() => {

    const ctx = gsap.context(() => {

      // Enhanced hero animations with stagger effects

      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      

      heroTl

        .from('.hero-badge', { 

          opacity: 0, 

          scale: 0.8, 

          y: 50, 

          duration: 1.2, 

          ease: 'elastic.out(1, 0.75)' 

        })

        .from('.hero-title-word', { 

          y: 150, 

          opacity: 0,

          stagger: 0.1, 

          duration: 1.5,

          ease: 'power4.out'

        }, '-=0.8')

        .from('.hero-subtitle', { 

          opacity: 0, 

          y: 50, 

          duration: 1.2 

        }, '-=0.6')

        .from('.hero-buttons', { 

          opacity: 0, 

          y: 30, 

          duration: 1 

        }, '-=0.4')

        .from('.hero-stats', { 

          opacity: 0, 

          y: 20, 

          stagger: 0.1, 

          duration: 0.8 

        }, '-=0.2');



      // Advanced scroll-triggered animations

      gsap.utils.toArray('.fade-in-up').forEach((element: any) => {

        gsap.fromTo(element, 

          { opacity: 0, y: 60 },

          {

            opacity: 1,

            y: 0,

            duration: 1.2,

            ease: 'power3.out',

            scrollTrigger: {

              trigger: element,

              start: 'top 85%',

              toggleActions: 'play none none reverse'

            }

          }

        );

      });



      // Parallax effects for sections

      gsap.utils.toArray('.parallax-bg').forEach((element: any) => {

        gsap.to(element, {

          yPercent: -50,

          ease: 'none',

          scrollTrigger: {

            trigger: element,

            start: 'top bottom',

            end: 'bottom top',

            scrub: true

          }

        });

      });



      // Stats counter animation

      gsap.utils.toArray('.stat-number').forEach((element: any) => {

        const endValue = parseInt(element.getAttribute('data-value'));

        gsap.fromTo(element, 

          { textContent: 0 },

          {

            textContent: endValue,

            duration: 2.5,

            ease: 'power2.out',

            snap: { textContent: 1 },

            scrollTrigger: {

              trigger: element,

              start: 'top 80%',

              toggleActions: 'play none none reverse'

            }

          }

        );

      });



      // Feature cards 3D hover effects

      gsap.utils.toArray('.feature-card').forEach((card: any) => {

        const tl = gsap.timeline({ paused: true });

        tl.to(card, { 

          rotationY: 5, 

          rotationX: 5, 

          z: 50, 

          duration: 0.3, 

          ease: 'power2.out' 

        });



        card.addEventListener('mouseenter', () => tl.play());

        card.addEventListener('mouseleave', () => tl.reverse());

      });



    }, containerRef);



    return () => ctx.revert();

  }, []);



  const features = [

    { 

      icon: <Brain className="w-8 h-8" />, 

      title: "Advanced AI Intelligence", 

      description: "Powered by cutting-edge models like GPT-4, Claude, and Gemini for human-like conversations.",

      gradient: "from-purple-500 to-pink-500"

    },

    { 

      icon: <Rocket className="w-8 h-8" />, 

      title: "Instant Deployment", 

      description: "From design to live deployment in under 60 seconds. No technical knowledge required.",

      gradient: "from-blue-500 to-cyan-500"

    },

    { 

      icon: <Palette className="w-8 h-8" />, 

      title: "Complete Customization", 

      description: "Brand colors, personality, knowledge base, and behavior - make it uniquely yours.",

      gradient: "from-green-500 to-emerald-500"

    },

    { 

      icon: <Shield className="w-8 h-8" />, 

      title: "Enterprise Security", 

      description: "Bank-grade encryption, private repositories, and SOC 2 compliance included.",

      gradient: "from-red-500 to-orange-500"

    },

    { 

      icon: <Globe className="w-8 h-8" />, 

      title: "Universal Integration", 

      description: "Works on any website, platform, or application with a single line of code.",

      gradient: "from-indigo-500 to-purple-500"

    },

    { 

      icon: <Target className="w-8 h-8" />, 

      title: "Smart Analytics", 

      description: "Real-time insights, conversation analytics, and performance optimization tools.",

      gradient: "from-yellow-500 to-orange-500"

    }

  ];



  const testimonials = [

    { 

      name: "Sarah Chen", 

      role: "CEO", 

      company: "TechFlow", 

      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", 

      content: "PLUDO.AI transformed our customer support. 400% increase in engagement, 60% reduction in support tickets. It's like having a team of expert agents working 24/7.",

      rating: 5,

      metrics: { engagement: "+400%", tickets: "-60%" }

    },

    { 

      name: "Marcus Rodriguez", 

      role: "Founder", 

      company: "InnovateLab", 

      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", 

      content: "The sophistication of this no-code platform is incredible. We launched a complex AI agent that doubled our conversion rates in the first week.",

      rating: 5,

      metrics: { conversion: "+200%", time: "1 week" }

    },

    { 

      name: "Lisa Williams", 

      role: "VP Marketing", 

      company: "GrowthCorp", 

      avatar: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2", 

      content: "We've deployed 50+ client-facing agents without a single technical issue. The reliability and performance are unmatched in the industry.",

      rating: 5,

      metrics: { agents: "50+", uptime: "99.9%" }

    }

  ];



  const pricingPlans = [

    {

      name: "Starter",

      price: "Free",

      description: "Perfect for trying out PLUDO.AI",

      features: [

        "1 AI Agent",

        "1,000 conversations/month",

        "Basic customization",

        "Community support",

        "Standard AI models"

      ],

      cta: "Start Free",

      popular: false

    },

    {

      name: "Professional",

      price: "$29",

      description: "For growing businesses",

      features: [

        "5 AI Agents",

        "10,000 conversations/month",

        "Advanced customization",

        "Priority support",

        "Premium AI models",

        "Analytics dashboard",

        "Custom branding"

      ],

      cta: "Start Trial",

      popular: true

    },

    {

      name: "Enterprise",

      price: "Custom",

      description: "For large organizations",

      features: [

        "Unlimited AI Agents",

        "Unlimited conversations",

        "White-label solution",

        "Dedicated support",

        "Custom AI training",

        "Advanced analytics",

        "SLA guarantee",

        "On-premise deployment"

      ],

      cta: "Contact Sales",

      popular: false

    }

  ];



  return (

    <div className="min-h-screen overflow-x-hidden bg-brand-dark text-white font-sans" ref={containerRef}>

      <FloatingParticles />

      

      {/* Enhanced Hero Section */}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background Video */}

        <video

          ref={heroVideoRef}

          autoPlay

          muted={videoMuted}

          loop

          playsInline

          className="absolute inset-0 w-full h-full object-cover opacity-20"

        >

          <source src="/hero-video.mp4" type="video/mp4" />

        </video>

        

        {/* Gradient Overlays */}

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-brand-dark/60 to-brand-dark" />

        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-transparent to-brand-dark/80" />

        

        {/* Grid Pattern */}

        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        

        {/* Floating Elements */}

        <div className="absolute top-20 left-20 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        

        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Badge */}

          <div className="hero-badge inline-flex items-center space-x-3 bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 mb-8">

            <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />

            <span className="text-brand-light-gold font-medium tracking-wide">The Future of AI Agents</span>

            <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />

          </div>

          

          {/* Hero Title */}

          <div className="mb-8">

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none">

              <span className="hero-title-word block">Build</span>

              <span className="hero-title-word block bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-200% bg-clip-text text-transparent animate-text-shimmer">Intelligent</span>

              <span className="hero-title-word block">AI Agents</span>

            </h1>

          </div>



          {/* Hero Subtitle */}

          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-12">

            The world's most advanced no-code platform for creating, deploying, and scaling 

            sophisticated AI agents that transform customer experiences.

          </p>

          

          {/* Hero Buttons */}

          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">

            <Link to="/signup">

              <Button size="lg" className="px-12 py-6 text-xl bg-brand-gold hover:bg-brand-light-gold text-black font-bold shadow-2xl shadow-brand-gold/30 transform hover:scale-105 transition-all duration-300 border-2 border-brand-gold">

                Start Building Free

                <ArrowRight className="w-6 h-6 ml-3" />

              </Button>

            </Link>

            <button 

              onClick={() => setVideoMuted(!videoMuted)}

              className="flex items-center text-xl text-gray-300 hover:text-white transition-colors group"

            >

              <span className="mr-4">Watch Demo</span>

              <div className="w-16 h-16 rounded-full border-2 border-gray-600 group-hover:border-brand-gold transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/5">

                {videoMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}

              </div>

            </button>

          </div>



          {/* Hero Stats */}

          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">

            {[

              { number: 50, suffix: "K+", label: "Active Agents" },

              { number: 99.9, suffix: "%", label: "Uptime" },

              { number: 2, suffix: "M+", label: "Daily Conversations" },

              { number: 150, suffix: "+", label: "Countries" }

            ].map((stat, index) => (

              <div key={index} className="text-center">

                <div className="text-3xl md:text-4xl font-black text-white mb-1">

                  <span className="stat-number" data-value={stat.number}>0</span>

                  <span className="text-brand-gold">{stat.suffix}</span>

                </div>

                <div className="text-gray-400 text-sm font-medium tracking-wider uppercase">{stat.label}</div>

              </div>

            ))}

          </div>

        </div>



        {/* Scroll Indicator */}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce">

          <span className="text-gray-400 text-xs uppercase tracking-widest">Scroll to Explore</span>

          <ChevronDown className="w-5 h-5 text-brand-gold" />

        </div>

      </section>



      {/* Interactive Demo Section */}

      <section className="py-32 bg-gradient-to-b from-brand-dark to-black relative overflow-hidden">

        <div className="parallax-bg absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />

        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-20">

            <h2 className="fade-in-up text-4xl md:text-6xl font-bold mb-6">

              See It In Action

            </h2>

            <p className="fade-in-up text-xl text-gray-400 max-w-3xl mx-auto">

              Watch how easy it is to create and deploy your AI agent in real-time.

            </p>

          </div>



          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="fade-in-up">

              <InteractiveDemo />

            </div>

            

            <div className="fade-in-up space-y-8">

              <h3 className="text-3xl font-bold text-white mb-6">

                From Concept to Deployment in Minutes

              </h3>

              

              <div className="space-y-6">

                {[

                  { icon: <Settings className="w-6 h-6" />, title: "Visual Configuration", desc: "Drag-and-drop interface for complete customization" },

                  { icon: <Brain className="w-6 h-6" />, title: "AI Model Selection", desc: "Choose from GPT-4, Claude, Gemini, and more" },

                  { icon: <Rocket className="w-6 h-6" />, title: "One-Click Deploy", desc: "Instant deployment to global CDN" },

                  { icon: <Code className="w-6 h-6" />, title: "Universal Embed", desc: "Works on any website with one line of code" }

                ].map((item, index) => (

                  <div key={index} className="flex items-start space-x-4">

                    <div className="flex-shrink-0 w-12 h-12 bg-brand-gold/20 rounded-xl flex items-center justify-center text-brand-gold">

                      {item.icon}

                    </div>

                    <div>

                      <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>

                      <p className="text-gray-400">{item.desc}</p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* Features Grid Section */}

      <section className="py-32 bg-black relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-20">

            <h2 className="fade-in-up text-4xl md:text-6xl font-bold mb-6">

              Engineered for Excellence

            </h2>

            <p className="fade-in-up text-xl text-gray-400 max-w-3xl mx-auto">

              Every feature is meticulously crafted to deliver unparalleled performance and user experience.

            </p>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature, index) => (

              <div key={index} className="fade-in-up">

                <Card className="feature-card p-8 h-full bg-gradient-to-br from-brand-gray to-brand-light-gray border border-brand-light-gray/30 rounded-3xl group hover:border-brand-gold/50 transition-all duration-500 transform hover:-translate-y-2">

                  <div className="mb-6">

                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>

                      <div className="text-white">{feature.icon}</div>

                    </div>

                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors">

                    {feature.title}

                  </h3>

                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">

                    {feature.description}

                  </p>

                </Card>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* Device Compatibility Section */}

      <section className="py-32 bg-gradient-to-b from-black to-brand-dark relative overflow-hidden">

        <div className="parallax-bg absolute inset-0 bg-gradient-to-l from-brand-gold/5 to-transparent" />

        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-20">

            <h2 className="fade-in-up text-4xl md:text-6xl font-bold mb-6">

              Works Everywhere

            </h2>

            <p className="fade-in-up text-xl text-gray-400 max-w-3xl mx-auto">

              Your AI agents adapt perfectly to any device, platform, or screen size.

            </p>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end justify-items-center">

            <div className="fade-in-up">

              <DeviceMockup type="mobile" />

            </div>

            <div className="fade-in-up">

              <DeviceMockup type="tablet" />

            </div>

            <div className="fade-in-up">

              <DeviceMockup type="desktop" />

            </div>

          </div>



          <div className="mt-20 text-center">

            <div className="fade-in-up inline-flex items-center space-x-8 bg-brand-gray/50 backdrop-blur-xl px-8 py-4 rounded-2xl border border-brand-gold/20">

              <div className="flex items-center space-x-2">

                <Check className="w-5 h-5 text-brand-gold" />

                <span className="text-gray-300">Responsive Design</span>

              </div>

              <div className="flex items-center space-x-2">

                <Check className="w-5 h-5 text-brand-gold" />

                <span className="text-gray-300">Cross-Platform</span>

              </div>

              <div className="flex items-center space-x-2">

                <Check className="w-5 h-5 text-brand-gold" />

                <span className="text-gray-300">Lightning Fast</span>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* Testimonials Section */}

      <section className="py-32 bg-brand-dark relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-20">

            <h2 className="fade-in-up text-4xl md:text-6xl font-bold mb-6">

              Trusted by Industry Leaders

            </h2>

            <p className="fade-in-up text-xl text-gray-400 max-w-3xl mx-auto">

              Join thousands of businesses transforming their customer experience.

            </p>

          </div>



          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {testimonials.map((testimonial, index) => (

              <div key={index} className="fade-in-up">

                <Card className="p-8 h-full bg-gradient-to-br from-brand-gray to-black border border-brand-light-gray/30 rounded-3xl hover:border-brand-gold/50 transition-all duration-500 group">

                  {/* Rating */}

                  <div className="flex mb-6">

                    {[...Array(testimonial.rating)].map((_, i) => (

                      <Star key={i} className="w-5 h-5 text-brand-gold fill-current" />

                    ))}

                  </div>

                  

                  {/* Metrics */}

                  <div className="flex space-x-4 mb-6">

                    {Object.entries(testimonial.metrics).map(([key, value]) => (

                      <div key={key} className="bg-brand-gold/10 px-3 py-1 rounded-full">

                        <span className="text-brand-gold font-bold text-sm">{value}</span>

                      </div>

                    ))}

                  </div>

                  

                  {/* Quote */}

                  <blockquote className="text-gray-300 mb-8 italic text-lg leading-relaxed flex-grow group-hover:text-white transition-colors">

                    "{testimonial.content}"

                  </blockquote>

                  

                  {/* Author */}

                  <div className="flex items-center">

                    <img 

                      src={testimonial.avatar} 

                      alt={testimonial.name} 

                      className="w-16 h-16 rounded-full mr-4 border-2 border-brand-gold/50 group-hover:border-brand-gold transition-colors" 

                    />

                    <div>

                      <div className="font-bold text-white text-lg">{testimonial.name}</div>

                      <div className="text-brand-gold font-medium">{testimonial.role}</div>

                      <div className="text-gray-400 text-sm">{testimonial.company}</div>

                    </div>

                  </div>

                </Card>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* Pricing Section */}

      <section className="py-32 bg-gradient-to-b from-brand-dark to-black relative overflow-hidden">

        <div className="parallax-bg absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />

        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-20">

            <h2 className="fade-in-up text-4xl md:text-6xl font-bold mb-6">

              Simple, Transparent Pricing

            </h2>

            <p className="fade-in-up text-xl text-gray-400 max-w-3xl mx-auto">

              Choose the perfect plan for your business. Start free, scale as you grow.

            </p>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {pricingPlans.map((plan, index) => (

              <div key={index} className="fade-in-up">

                <Card className={`p-8 h-full rounded-3xl transition-all duration-500 transform hover:-translate-y-2 ${

                  plan.popular 

                    ? 'bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border-2 border-brand-gold scale-105' 

                    : 'bg-gradient-to-br from-brand-gray to-black border border-brand-light-gray/30 hover:border-brand-gold/50'

                }`}>

                  {plan.popular && (

                    <div className="text-center mb-4">

                      <span className="bg-brand-gold text-black px-4 py-1 rounded-full text-sm font-bold">

                        Most Popular

                      </span>

                    </div>

                  )}

                  

                  <div className="text-center mb-8">

                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>

                    <div className="text-4xl font-black text-white mb-2">

                      {plan.price}

                      {plan.price !== 'Free' && plan.price !== 'Custom' && (

                        <span className="text-lg text-gray-400 font-normal">/month</span>

                      )}

                    </div>

                    <p className="text-gray-400">{plan.description}</p>

                  </div>



                  <ul className="space-y-4 mb-8">

                    {plan.features.map((feature, featureIndex) => (

                      <li key={featureIndex} className="flex items-center">

                        <Check className="w-5 h-5 text-brand-gold mr-3 flex-shrink-0" />

                        <span className="text-gray-300">{feature}</span>

                      </li>

                    ))}

                  </ul>



                  <Button 

                    className={`w-full py-4 text-lg font-bold transition-all duration-300 ${

                      plan.popular

                        ? 'bg-brand-gold hover:bg-brand-light-gold text-black'

                        : 'bg-brand-gray hover:bg-brand-light-gray text-white border border-brand-gold/30 hover:border-brand-gold'

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



      {/* Final CTA Section */}

      <section className="py-32 relative overflow-hidden bg-gradient-to-t from-brand-gold/20 via-brand-dark to-brand-dark">

        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-brand-dark/50 to-brand-dark" />

        

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          <div className="space-y-12">

            <div className="fade-in-up">

              <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">

                Ready to Transform

                <br />

                <span className="bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-200% bg-clip-text text-transparent animate-text-shimmer">

                  Your Business?

                </span>

              </h2>

            </div>

            

            <p className="fade-in-up text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">

              Join thousands of visionary businesses already transforming their customer experience with AI.

            </p>

            

            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-8">

              <Link to="/signup">

                <Button size="lg" className="px-16 py-8 text-2xl bg-brand-gold hover:bg-brand-light-gold text-black font-bold shadow-2xl shadow-brand-gold/40 transform hover:scale-105 transition-all duration-300 border-2 border-brand-gold">

                  Start Building Now

                  <ArrowRight className="w-8 h-8 ml-4" />

                </Button>

              </Link>

              

              <Link to="/create">

                <Button size="lg" variant="outline" className="px-16 py-8 text-2xl border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-bold transition-all duration-300">

                  View Demo

                  <Eye className="w-8 h-8 ml-4" />

                </Button>

              </Link>

            </div>

            

            <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400 text-lg font-medium">

              <div className="flex items-center">

                <Check className="w-6 h-6 mr-3 text-brand-gold" />

                Free forever plan

              </div>

              <div className="flex items-center">

                <Check className="w-6 h-6 mr-3 text-brand-gold" />

                No credit card required

              </div>

              <div className="flex items-center">

                <Check className="w-6 h-6 mr-3 text-brand-gold" />

                Deploy in 60 seconds

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

};