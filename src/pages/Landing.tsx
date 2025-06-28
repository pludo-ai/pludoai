import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Landing: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  
  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const ySpring1 = useSpring(y1, springConfig);
  const ySpring2 = useSpring(y2, springConfig);
  const ySpring3 = useSpring(y3, springConfig);

  useEffect(() => {
    // Ensure video plays on load
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
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
      description: "Customize appearance, personality, and knowledge base using our intuitive form builder."
    },
    {
      number: "02",
      title: "AI Generation",
      description: "Our AI crafts the perfect prompts and responses based on your business requirements."
    },
    {
      number: "03",
      title: "Auto Deploy",
      description: "Instantly deployed to repository and cloud with a custom domain and embed code ready to use."
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
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ scale, opacity }}
        >
          <div className="absolute inset-0 bg-black/30 z-10" />
          <iframe
            ref={videoRef}
            src="https://streamable.com/e/k5toe4?autoplay=1&nocontrols=1"
            className="w-full h-full object-cover"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-20" />
        
        {/* Animated Particles */}
        <motion.div 
          className="absolute inset-0 z-20"
          style={{ y: ySpring1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
            style={{ y: ySpring2 }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>No-Code AI Agent Generator</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Create{' '}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Intelligent
              </motion.span>
              <br />
              AI Agents in Minutes
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Build, customize, and deploy AI chatbots for your business without any coding. 
              From customer support to lead generation, create the perfect AI assistant.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl">
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <motion.button 
                className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30"
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                  <Play className="w-5 h-5 ml-1" />
                </motion.div>
                <span className="font-medium">Watch Demo</span>
              </motion.button>
            </motion.div>

            <motion.div 
              className="pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p className="text-sm text-gray-300 mb-4">Trusted by 10,000+ businesses worldwide</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                {/* Logo placeholders with subtle animation */}
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="w-24 h-8 bg-white/20 rounded backdrop-blur-sm"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.5 
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section with Parallax */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{ y: ySpring1 }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to Build{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Amazing AI Agents
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From design to deployment, we handle the complexity so you can focus on growing your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                style={{ y: index % 2 === 0 ? ySpring1 : ySpring2 }}
              >
                <Card hover className="p-8 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <motion.div 
                    className="text-primary-600 dark:text-primary-400 mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with Scroll Animations */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y: ySpring2 }}
        >
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Three simple steps to launch your AI agent and start engaging with customers.
            </p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse lg:space-x-reverse' : ''
                }`}
                style={{ y: index % 2 === 0 ? ySpring1 : ySpring3 }}
              >
                <div className="flex-1">
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.number}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl flex items-center justify-center shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <motion.div 
                      className="text-6xl"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {index === 0 ? '🎨' : index === 1 ? '🤖' : '🚀'}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with Parallax */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{ y: ySpring3 }}
        >
          <div className="absolute top-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Loved by Businesses Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how companies are transforming their customer experience with AI agents.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{ y: index % 2 === 0 ? ySpring1 : ySpring2 }}
              >
                <Card className="p-8 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-300 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <motion.img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Video Overlay Effect */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{ y: ySpring2 }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ready to Transform Your Business?
            </motion.h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of businesses already using AI agents to provide better customer experiences.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-8 py-4 text-lg bg-white text-primary-600 border-white hover:bg-primary-50 shadow-2xl"
                  >
                    Start Building Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div 
                className="text-primary-100 text-sm flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Check className="w-4 h-4 inline mr-2" />
                No credit card required
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full"
          animate={{ 
            y: [0, 20, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </section>
    </div>
  );
};