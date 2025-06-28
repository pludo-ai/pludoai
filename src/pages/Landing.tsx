import React, { useRef, useEffect, useState, FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Rocket, Palette, Shield, Globe, Target, Sparkles, ArrowRight,
  Play, Pause, Volume2, VolumeX, Check, Star, Settings, Code,
  Monitor, Tablet, Smartphone, Bot, ChevronDown, Github, Twitter, Linkedin, Mail,
  MessageSquare, Zap, Users, TrendingUp, Award, Clock, MapPin
} from 'lucide-react';

// Self-contained UI Components
const Button: FC<{ children: ReactNode; className?: string; href?: string; variant?: 'outline' | 'ghost'; size?: 'sm' | 'md' | 'lg' }> = ({ 
  children, className = '', href, variant, size = 'md' 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 transform hover:scale-105";
  const variantClasses = variant === 'outline'
    ? 'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black'
    : variant === 'ghost'
    ? 'text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10'
    : 'bg-brand-gold hover:bg-brand-light-gold text-black shadow-lg shadow-brand-gold/30';
  
  const sizeClasses = size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base';
  
  const Component = href ? 'a' : 'button';
  return (
    <Component href={href} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      {children}
    </Component>
  );
};

const Card: FC<{ children: ReactNode; className?: string; hover?: boolean }> = ({ children, className = '', hover = false }) => (
  <div className={`${hover ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}>
    {children}
  </div>
);

// Hero Section with Enhanced Video Background
const HeroSection: FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.3) contrast(1.2)' }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/852441/852441-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-brand-dark/60 to-black/80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-10" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-gold rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center space-x-3 bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
          <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
          <span className="text-brand-light-gold font-medium tracking-wide">The Future of AI is Here</span>
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-none">
            <span className="hero-title-word-container block overflow-hidden">
              <span className="hero-title-word inline-block text-white">Build</span>
            </span>
            <span className="hero-title-word-container block overflow-hidden">
              <span className="hero-title-word inline-block bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-200% bg-clip-text text-transparent animate-text-shimmer">
                Intelligent
              </span>
            </span>
            <span className="hero-title-word-container block overflow-hidden">
              <span className="hero-title-word inline-block text-white">AI Agents</span>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
          The world's most advanced no-code platform for creating, deploying, and scaling 
          sophisticated AI agents that transform customer experiences.
        </p>

        {/* CTA Buttons */}
        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button href="/signup" size="lg" className="group">
            Start Building Free 
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="flex items-center text-lg text-gray-300 hover:text-white transition-colors group"
          >
            <span className="mr-3">Watch Demo</span>
            <div className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-brand-gold transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/5">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
          {[
            { number: '50K+', label: 'Active Agents' },
            { number: '99.9%', label: 'Uptime' },
            { number: '150+', label: 'Countries' },
            { number: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-gold">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2">
        <span className="text-gray-400 text-xs uppercase tracking-widest">Explore</span>
        <ChevronDown className="w-5 h-5 text-brand-gold animate-bounce" />
      </div>
    </section>
  );
};

// Enhanced Gallery Section with Multiple Gallery Types
const GallerySection: FC<{ galleryPinRef: React.RefObject<HTMLDivElement>; horizontalGalleryRef: React.RefObject<HTMLDivElement> }> = ({ 
  galleryPinRef, horizontalGalleryRef 
}) => {
  const galleryItems = [
    // AI Dashboard Gallery
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop',
      title: 'AI Analytics Dashboard',
      category: 'Analytics',
      description: 'Real-time insights and performance metrics'
    },
    // Video: AI in Action
    {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/4434246/4434246-hd_1920_1080_25fps.mp4',
      title: 'AI Agents in Action',
      category: 'Demo',
      description: 'See how AI agents handle customer interactions'
    },
    // Team Collaboration
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop',
      title: 'Team Collaboration',
      category: 'Workflow',
      description: 'Seamless team collaboration and management'
    },
    // Global Network
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop',
      title: 'Global Deployment',
      category: 'Infrastructure',
      description: 'Deploy agents worldwide with one click'
    },
    // AI Brain/Neural Network
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop',
      title: 'Neural Intelligence',
      category: 'AI Technology',
      description: 'Advanced neural networks powering conversations'
    },
    // Customer Support Interface
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop',
      title: 'Customer Support Hub',
      category: 'Support',
      description: 'Intelligent customer service automation'
    },
    // Mobile App Interface
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2000&auto=format&fit=crop',
      title: 'Mobile Experience',
      category: 'Mobile',
      description: 'Optimized for all devices and platforms'
    },
    // Security & Privacy
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2000&auto=format&fit=crop',
      title: 'Enterprise Security',
      category: 'Security',
      description: 'Bank-level security and data protection'
    }
  ];

  return (
    <section ref={galleryPinRef} className="relative bg-brand-dark overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <div className="inline-flex items-center space-x-2 bg-brand-gold/10 px-4 py-2 rounded-full mb-6">
          <Palette className="w-4 h-4 text-brand-gold" />
          <span className="text-brand-gold font-medium text-sm">Visual Experience</span>
        </div>
        <h2 className="section-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-brand-gold to-white bg-clip-text text-transparent">
          A Canvas for Your Vision
        </h2>
        <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          From concept to reality, our platform provides the tools to build stunningly effective AI agents 
          that work seamlessly across all platforms and devices.
        </p>
      </div>

      {/* Horizontal Scrolling Gallery */}
      <div className="relative">
        <div ref={horizontalGalleryRef} className="flex items-center space-x-6 md:space-x-8 pl-4 md:pl-8 lg:pl-16 pb-16">
          {galleryItems.map((item, index) => (
            <div 
              key={index} 
              className="horizontal-gallery-item flex-shrink-0 group cursor-pointer"
              style={{
                width: 'clamp(300px, 40vw, 500px)',
                height: 'clamp(200px, 25vw, 350px)'
              }}
            >
              <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl">
                {/* Media Content */}
                <div className="absolute inset-0">
                  {item.type === 'video' ? (
                    <video 
                      className="gallery-item-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
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
                      className="gallery-item-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="inline-flex items-center space-x-2 bg-brand-gold/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                      <span className="text-brand-gold text-xs font-medium">{item.category}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-gold/50 rounded-2xl md:rounded-3xl transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hidden lg:block">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section with Enhanced Cards
const FeaturesSection: FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Advanced AI Models",
      description: "Access to GPT-4, Claude, Gemini, and more cutting-edge AI models for superior conversations.",
      stats: "99.9% accuracy"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Deployment",
      description: "Deploy your AI agent in under 60 seconds with automatic scaling and global CDN distribution.",
      stats: "<60s deploy"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption, ensuring your data and conversations stay secure.",
      stats: "SOC 2 certified"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Scale",
      description: "Serve customers worldwide with multi-language support and regional data compliance.",
      stats: "150+ countries"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Complete Customization",
      description: "Brand your agent with custom colors, avatars, and personality to match your business perfectly.",
      stats: "Unlimited themes"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart Conversations",
      description: "Context-aware responses with memory, sentiment analysis, and intelligent routing capabilities.",
      stats: "95% satisfaction"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 bg-brand-gold/10 px-4 py-2 rounded-full mb-6">
            <Rocket className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold font-medium text-sm">Powerful Features</span>
          </div>
          <h2 className="section-heading text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Everything You Need to Succeed
          </h2>
          <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Built for scale, designed for simplicity. Our platform provides enterprise-grade features 
            with a user-friendly interface that anyone can master.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              hover 
              className="fade-in-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative p-8 bg-gradient-to-br from-brand-gray to-black border border-brand-light-gray/30 rounded-3xl hover:border-brand-gold/50 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-brand-gold/20 to-brand-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-brand-gold">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Stats */}
                <div className="inline-flex items-center space-x-2 bg-brand-gold/10 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 text-brand-gold" />
                  <span className="text-brand-gold text-sm font-medium">{feature.stats}</span>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Integrations Section with Animated Logos
const IntegrationsSection: FC = () => {
  const integrations = [
    { name: 'Slack', logo: '💬' },
    { name: 'HubSpot', logo: '🎯' },
    { name: 'Salesforce', logo: '☁️' },
    { name: 'Zendesk', logo: '🎧' },
    { name: 'Intercom', logo: '💭' },
    { name: 'Zapier', logo: '⚡' },
    { name: 'Shopify', logo: '🛍️' },
    { name: 'Discord', logo: '🎮' },
    { name: 'WhatsApp', logo: '📱' },
    { name: 'Telegram', logo: '✈️' },
    { name: 'Microsoft Teams', logo: '👥' },
    { name: 'Google Workspace', logo: '🌐' }
  ];

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-brand-gold/10 px-4 py-2 rounded-full mb-6">
          <Globe className="w-4 h-4 text-brand-gold" />
          <span className="text-brand-gold font-medium text-sm">Integrations</span>
        </div>
        <h2 className="section-heading text-3xl md:text-5xl font-bold mb-4 text-white">
          Integrates With Your Favorite Tools
        </h2>
        <p className="section-subheading text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
          Connect seamlessly with the platforms you already use. No complex setup required.
        </p>

        {/* Animated Logo Grid */}
        <div className="relative">
          <div className="flex animate-marquee">
            {[...integrations, ...integrations].map((integration, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 mx-8 flex flex-col items-center justify-center h-24 w-32 group"
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {integration.logo}
                </div>
                <p className="text-sm font-medium text-gray-400 group-hover:text-brand-gold transition-colors">
                  {integration.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection: FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&h=150&auto=format&fit=crop&crop=face",
      content: "PLUDO.AI transformed our customer support. We saw a 300% increase in engagement and 60% reduction in response time.",
      rating: 5,
      company: "TechFlow"
    },
    {
      name: "Marcus Johnson",
      role: "Founder, StartupX",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop&crop=face",
      content: "The deployment speed is incredible. We had our AI agent live in under 5 minutes. The ROI has been phenomenal.",
      rating: 5,
      company: "StartupX"
    },
    {
      name: "Lisa Rodriguez",
      role: "Head of Digital, Enterprise Corp",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop&crop=face",
      content: "Enterprise-grade security with consumer-grade simplicity. Our team was up and running without any technical training.",
      rating: 5,
      company: "Enterprise Corp"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 bg-brand-gold/10 px-4 py-2 rounded-full mb-6">
            <Users className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold font-medium text-sm">Customer Stories</span>
          </div>
          <h2 className="section-heading text-4xl md:text-6xl font-bold mb-6 text-white">
            Loved by Innovators Worldwide
          </h2>
          <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of businesses that have transformed their customer experience with AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} hover className="fade-in-up">
              <div className="p-8 bg-gradient-to-br from-brand-gray to-black border border-brand-light-gray/30 rounded-3xl h-full">
                {/* Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-300 mb-8 text-lg leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-brand-gold/30"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-brand-gold">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection: FC = () => {
  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals and small projects.",
      features: [
        "1 AI Agent",
        "1,000 conversations/mo",
        "Basic customization",
        "Community support",
        "Standard AI models"
      ],
      cta: "Start for Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      description: "For growing businesses and startups.",
      features: [
        "5 AI Agents",
        "10,000 conversations/mo",
        "Advanced customization",
        "Priority support",
        "Analytics dashboard",
        "Premium AI models",
        "Custom integrations"
      ],
      cta: "Start Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale, custom deployments.",
      features: [
        "Unlimited Agents",
        "Unlimited conversations",
        "White-label solution",
        "Dedicated support & SLA",
        "On-premise option",
        "Custom AI training",
        "Advanced analytics"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 bg-brand-gold/10 px-4 py-2 rounded-full mb-6">
            <Award className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold font-medium text-sm">Pricing</span>
          </div>
          <h2 className="section-heading text-4xl md:text-6xl font-bold mb-6 text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="section-subheading text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your business. Start free, scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => (
            <div key={plan.name} className="fade-in-up flex" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card className={`p-8 w-full flex flex-col rounded-3xl transition-all duration-300 relative ${
                plan.popular 
                  ? 'bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 border-2 border-brand-gold transform-none lg:scale-110' 
                  : 'bg-gradient-to-br from-brand-gray to-black border border-brand-light-gray/30 hover:border-brand-gold/50'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-gold text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl lg:text-5xl font-black text-white mb-2">
                    {plan.price}
                    {plan.price !== 'Free' && plan.price !== 'Custom' && (
                      <span className="text-lg text-gray-400 font-normal">/mo</span>
                    )}
                  </div>
                  <p className="text-gray-400 h-12 flex items-center justify-center">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-brand-gold mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  href="/signup" 
                  className={`w-full py-4 text-lg mt-auto ${
                    plan.popular ? '' : 'bg-transparent border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black'
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
  );
};

// CTA Section
const CTASection: FC = () => (
  <section className="py-24 md:py-32 bg-gradient-to-r from-brand-gold to-yellow-400 relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')]" />
    </div>

    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="space-y-8">
        <h2 className="text-4xl md:text-6xl font-black text-black leading-tight">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl md:text-2xl text-black/80 max-w-2xl mx-auto leading-relaxed">
          Join thousands of businesses already using AI agents to provide better customer experiences 
          and drive growth.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button 
            href="/signup" 
            size="lg"
            className="bg-black hover:bg-gray-900 text-brand-gold border-2 border-black hover:border-gray-900"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Building Now
          </Button>
          <div className="flex items-center text-black/80">
            <Check className="w-5 h-5 mr-2" />
            <span className="font-medium">No credit card required</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-black/60">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">SOC 2 Compliant</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">50K+ Active Users</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Footer Component
const Footer: FC = () => (
  <footer className="bg-black border-t border-brand-gold/20 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-brand-gold to-yellow-400 rounded-2xl">
              <Bot className="w-8 h-8 text-black" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">PLUDO.AI</span>
              <div className="text-xs text-gray-400">AI Agent Platform</div>
            </div>
          </Link>
          <p className="text-gray-400 max-w-sm">
            The world's most advanced no-code platform for creating AI agents.
          </p>
          <div className="flex space-x-4">
            {[Twitter, Github, Linkedin, Mail].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="p-2 text-gray-400 hover:text-brand-gold transition-colors rounded-lg hover:bg-brand-gold/10"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Product</h4>
          <ul className="space-y-3">
            {['Features', 'Pricing', 'Templates', 'Integrations'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Resources</h4>
          <ul className="space-y-3">
            {['Documentation', 'Blog', 'Support', 'Community'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
          <ul className="space-y-3">
            {['About', 'Careers', 'Contact', 'Privacy'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-brand-gold/20 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} PLUDO.AI Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Main Landing Page Component
export const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalGalleryRef = useRef<HTMLDivElement>(null);
  const galleryPinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if GSAP is available
    if (typeof window !== 'undefined' && (window as any).gsap && (window as any).ScrollTrigger) {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Hero Animations
        const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
        heroTl
          .from('.hero-badge', { opacity: 0, scale: 0.8, y: 50, ease: 'elastic.out(1, 0.75)' })
          .from('.hero-title-word', { yPercent: 120, opacity: 0, stagger: 0.1, duration: 1 }, '-=0.8')
          .from('.hero-subtitle', { opacity: 0, y: 50 }, '-=0.6')
          .from('.hero-buttons', { opacity: 0, y: 30 }, '-=0.5')
          .from('.hero-stats', { opacity: 0, y: 30 }, '-=0.4')
          .from('.scroll-indicator', { opacity: 0 }, '-=0.5');

        // Gallery Horizontal Scroll
        if (galleryPinRef.current && horizontalGalleryRef.current) {
          const galleryItems = horizontalGalleryRef.current.children;
          const totalWidth = Array.from(galleryItems).reduce((acc, item) => {
            return acc + (item as HTMLElement).offsetWidth + 32; // 32px for gap
          }, 0);
          
          const amountToScroll = totalWidth - window.innerWidth;

          if (amountToScroll > 0) {
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
            gsap.utils.toArray('.horizontal-gallery-item').forEach((item: any) => {
              gsap.to(item.querySelector('.gallery-item-image'), {
                y: '-10%',
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                  containerAnimation: gsap.to(horizontalGalleryRef.current, { x: -amountToScroll }).scrollTrigger?.animation
                }
              });
            });
          }
        }

        // Section Animations
        gsap.utils.toArray('.section-heading, .section-subheading').forEach((el: any) => {
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

        gsap.utils.toArray('.fade-in-up').forEach((el: any, index) => {
          gsap.from(el, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            delay: index * 0.1,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          });
        });

      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <div className="bg-brand-dark text-white font-sans overflow-x-hidden" ref={containerRef}>
      <main>
        <HeroSection />
        <GallerySection galleryPinRef={galleryPinRef} horizontalGalleryRef={horizontalGalleryRef} />
        <FeaturesSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
      
      <style jsx global>{`
        .hero-title-word-container { 
          display: inline-block; 
          overflow: hidden; 
        }
        .hero-title-word { 
          display: inline-block; 
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .fade-in-up {
          opacity: 0;
          transform: translateY(50px);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .horizontal-gallery-item {
            width: 85vw !important;
            height: 50vw !important;
            min-height: 250px;
            max-height: 400px;
          }
        }
        
        @media (max-width: 640px) {
          .horizontal-gallery-item {
            width: 90vw !important;
            height: 60vw !important;
            min-height: 200px;
            max-height: 350px;
          }
        }
        
        /* Ensure smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbars but keep functionality */
        .horizontal-gallery-container::-webkit-scrollbar {
          display: none;
        }
        .horizontal-gallery-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};