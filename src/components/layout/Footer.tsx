import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Github, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight, Sparkles, Heart, Zap, Globe, Shield, Code, Users } from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-black to-brand-dark border-t border-brand-gold/20">
      {/* Newsletter Section */}
      <div className="border-b border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-brand-gold/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span className="text-brand-gold font-medium text-sm">Stay Updated</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get the Latest AI Insights
            </h3>
            <p className="text-xl text-gray-400 mb-8">
              Join 50,000+ innovators receiving weekly updates on AI trends, platform updates, and success stories.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-brand-gray border border-brand-light-gray/30 rounded-xl text-white placeholder-gray-400 focus:border-brand-gold focus:outline-none transition-colors"
              />
              <Button className="bg-brand-gold hover:bg-brand-light-gold text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No spam, unsubscribe anytime. Read our{' '}
              <Link to="/privacy" className="text-brand-gold hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="p-3 bg-gradient-to-r from-brand-gold to-yellow-400 rounded-2xl shadow-lg shadow-brand-gold/30 group-hover:shadow-brand-gold/50 transition-all duration-300">
                <Bot className="w-8 h-8 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-brand-gold to-white bg-clip-text text-transparent">
                  PLUDO.AI
                </span>
                <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                  AI Agent Platform
                </span>
              </div>
            </Link>
            
            <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
              The world's most advanced no-code platform for creating, deploying, and scaling 
              sophisticated AI agents that transform customer experiences.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-2xl font-bold text-brand-gold">50K+</div>
                <div className="text-sm text-gray-400">Active Agents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-gold">99.9%</div>
                <div className="text-sm text-gray-400">Uptime SLA</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "mailto:hello@pludo.ai", label: "Email" }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="p-3 bg-brand-gray hover:bg-brand-gold/20 border border-brand-light-gray/30 hover:border-brand-gold/50 rounded-xl text-gray-400 hover:text-brand-gold transition-all duration-300 group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 text-brand-gold mr-2" />
              Product
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Features", href: "/features" },
                { name: "Pricing", href: "/pricing" },
                { name: "Templates", href: "/templates" },
                { name: "Integrations", href: "/integrations" },
                { name: "API", href: "/api" },
                { name: "Changelog", href: "/changelog" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-brand-gold transition-colors flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Code className="w-5 h-5 text-brand-gold mr-2" />
              Resources
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Documentation", href: "/docs" },
                { name: "Tutorials", href: "/tutorials" },
                { name: "Blog", href: "/blog" },
                { name: "Case Studies", href: "/case-studies" },
                { name: "Community", href: "/community" },
                { name: "Support", href: "/support" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-brand-gold transition-colors flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 text-brand-gold mr-2" />
              Company
            </h3>
            <ul className="space-y-4">
              {[
                { name: "About Us", href: "/about" },
                { name: "Careers", href: "/careers" },
                { name: "Press Kit", href: "/press" },
                { name: "Partners", href: "/partners" },
                { name: "Contact", href: "/contact" },
                { name: "Status", href: "/status" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-brand-gold transition-colors flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3 text-brand-gold" />
                <span className="text-sm">hello@pludo.ai</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Globe className="w-4 h-4 mr-3 text-brand-gold" />
                <span className="text-sm">Global Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center text-gray-400 text-sm">
              <span>© {currentYear} PLUDO.AI. All rights reserved.</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for innovators
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-brand-gold text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-brand-gold text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="text-gray-400 hover:text-brand-gold text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>

            {/* Security Badge */}
            <div className="flex items-center space-x-2 bg-brand-gray/50 px-4 py-2 rounded-lg border border-brand-light-gray/30">
              <Shield className="w-4 h-4 text-brand-gold" />
              <span className="text-xs text-gray-400 font-medium">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};