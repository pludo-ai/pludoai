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
  Play,
  Sparkles,
  Code,
  Palette,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const Landing: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      const tl = gsap.timeline();
      
      // Animated title with typewriter effect
      tl.from(titleRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "power4.out"
      })
      .to(titleRef.current?.querySelector('.highlight'), {
        backgroundPosition: "200% center",
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      }, "-=0.5")
      .from(subtitleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .from(".hero-button", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=0.5");

      // Floating particles animation
      gsap.to(".particle", {
        y: -100,
        opacity: 0,
        duration: 3,
        stagger: {
          amount: 2,
          from: "random"
        },
        repeat: -1,
        ease: "power2.out"
      });

      // Scroll indicator animation
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      // Video section - triggered after 50% scroll
      ScrollTrigger.create({
        trigger: videoRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          gsap.fromTo(videoRef.current, 
            { 
              opacity: 0, 
              scale: 0.8,
              rotationY: 15
            },
            { 
              opacity: 1, 
              scale: 1,
              rotationY: 0,
              duration: 1.5,
              ease: "power3.out",
              onComplete: () => {
                // Auto-play video when it comes into view
                if (videoElementRef.current) {
                  videoElementRef.current.play().catch(console.error);
                }
              }
            }
          );
        }
      });

      // Features section with stagger animation
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.fromTo(".feature-card", 
            { 
              opacity: 0, 
              y: 100,
              rotationX: 45
            },
            { 
              opacity: 1, 
              y: 0,
              rotationX: 0,
              duration: 1,
              stagger: 0.15,
              ease: "power3.out"
            }
          );
        }
      });

      // Steps section with timeline
      ScrollTrigger.create({
        trigger: stepsRef.current,
        start: "top 70%",
        onEnter: () => {
          const stepTl = gsap.timeline();
          stepTl.fromTo(".step-item", 
            { 
              opacity: 0, 
              x: (index) => index % 2 === 0 ? -100 : 100,
              scale: 0.8
            },
            { 
              opacity: 1, 
              x: 0,
              scale: 1,
              duration: 1.2,
              stagger: 0.3,
              ease: "power3.out"
            }
          )
          .fromTo(".step-number", 
            { 
              scale: 0,
              rotation: 180
            },
            { 
              scale: 1,
              rotation: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "back.out(1.7)"
            }, "-=1"
          );
        }
      });

      // Testimonials with 3D effect
      ScrollTrigger.create({
        trigger: testimonialsRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.fromTo(".testimonial-card", 
            { 
              opacity: 0, 
              z: -100,
              rotationY: 45
            },
            { 
              opacity: 1, 
              z: 0,
              rotationY: 0,
              duration: 1.2,
              stagger: 0.2,
              ease: "power3.out"
            }
          );
        }
      });

      // CTA section with magnetic effect
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(ctaRef.current, 
            { 
              opacity: 0, 
              scale: 0.9
            },
            { 
              opacity: 1, 
              scale: 1,
              duration: 1,
              ease: "power3.out"
            }
          );
        }
      });

      // Parallax backgrounds
      gsap.to(".parallax-bg-1", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg-1",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".parallax-bg-2", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg-2",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Smooth scroll reveal for text elements
      gsap.utils.toArray('.reveal-text').forEach((element: any) => {
        gsap.fromTo(element, 
          { 
            opacity: 0, 
            y: 50 
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "No-Code AI Creation",
      description: "Build sophisticated AI agents without writing a single line of code. Our intuitive interface makes it simple."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Deployment",
      description: "Deploy your AI agent to the web in seconds. Automatic repository creation and cloud hosting included."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Full Customization",
      description: "Brand your agent with custom colors, avatars, and personality. Make it truly yours with our design tools."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Embed Anywhere",
      description: "Add your AI agent to any website with a simple script tag. Works on WordPress, Shopify, and custom sites."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart Conversations",
      description: "Powered by advanced AI models, your agent understands context and provides helpful, accurate responses."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Your data is secure with enterprise-grade encryption and private repository hosting."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Design Your Agent",
      description: "Customize appearance, personality, and knowledge base using our intuitive form builder.",
      icon: "🎨"
    },
    {
      number: "02",
      title: "AI Generation",
      description: "Our AI crafts the perfect prompts and responses based on your business requirements.",
      icon: "🤖"
    },
    {
      number: "03",
      title: "Auto Deploy",
      description: "Instantly deployed to repository and cloud with a custom domain and embed code ready to use.",
      icon: "🚀"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "E-commerce Owner",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
      content: "Increased customer engagement by 300% after adding our AI assistant. Setup took less than 10 minutes!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "SaaS Founder",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
      content: "PLUDO.AI saved us months of development. Our support tickets dropped by 60% with our new AI agent.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Digital Agency Owner",
      avatar: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
      content: "We've deployed AI agents for 20+ clients. The quality and customization options are incredible.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" ref={heroRef}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="parallax-bg-1 absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
          
          {/* Floating Particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm font-medium border border-white/20 shadow-2xl">
              <Sparkles className="w-4 h-4" />
              <span>No-Code AI Agent Generator</span>
            </div>

            {/* Main Title */}
            <h1 
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight"
            >
              Create{' '}
              <span className="highlight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-300% animate-gradient">
                Intelligent
              </span>
              <br />
              AI Agents in Minutes
            </h1>

            {/* Subtitle */}
            <p 
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Build, customize, and deploy AI chatbots for your business without any coding. 
              From customer support to lead generation, create the perfect AI assistant.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
              <Link to="/signup" className="hero-button">
                <Button 
                  size="lg" 
                  className="px-10 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <button className="hero-button flex items-center space-x-3 text-white hover:text-blue-300 transition-colors group">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                  <Play className="w-6 h-6 ml-1" />
                </div>
                <span className="font-medium text-lg">Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12">
              <p className="text-sm text-gray-400 mb-6">Trusted by 10,000+ businesses worldwide</p>
              <div className="flex items-center justify-center space-x-12 opacity-60">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-28 h-10 bg-white/20 rounded-lg backdrop-blur-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center space-y-2 text-white/70">
            <span className="text-sm font-medium">Scroll to explore</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Video Section - Triggered after 50% scroll */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="parallax-bg-2 absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="reveal-text text-4xl md:text-5xl font-bold text-white mb-6">
              See the Future of{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Automation
              </span>
            </h2>
            <p className="reveal-text text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the seamless integration of artificial intelligence into your business workflow
            </p>
          </div>
          
          <div 
            ref={videoRef}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <video
              ref={videoElementRef}
              className="w-full h-auto"
              muted
              loop
              playsInline
              preload="metadata"
              poster="/hero-video-poster.jpg"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            
            {/* Video overlay with play button for manual control */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => {
                  if (videoElementRef.current) {
                    if (videoElementRef.current.paused) {
                      videoElementRef.current.play();
                    } else {
                      videoElementRef.current.pause();
                    }
                  }
                }}
                className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="reveal-text text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to Build{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Amazing AI Agents
              </span>
            </h2>
            <p className="reveal-text text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From design to deployment, we handle the complexity so you can focus on growing your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group"
              >
                <Card className="p-8 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="text-primary-600 dark:text-primary-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="reveal-text text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="reveal-text text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Three simple steps to launch your AI agent and start engaging with customers.
            </p>
          </div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step-item flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-16 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse lg:space-x-reverse' : ''
                }`}
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="step-number w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl">
                      {step.number}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
                
                <div className="flex-1">
                  <div className="w-full h-80 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl flex items-center justify-center shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <div className="text-8xl transform hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="reveal-text text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Loved by Businesses Worldwide
            </h2>
            <p className="reveal-text text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how companies are transforming their customer experience with AI agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card group"
              >
                <Card className="p-8 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-300 mb-8 italic text-lg leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full mr-4 shadow-lg"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses already using AI agents to provide better customer experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 pt-8">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="px-10 py-4 text-lg bg-white text-primary-600 hover:bg-gray-100 shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Building Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <div className="flex items-center text-primary-100 text-lg">
                <Check className="w-5 h-5 mr-2" />
                No credit card required
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full animate-float-delayed"></div>
      </section>
    </div>
  );
};