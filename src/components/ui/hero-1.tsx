'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from './dialog'
import { Menu, X, Crown, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { Button } from './Button'

interface NavigationItem {
  name: string
  href: string
}

interface AnnouncementBanner {
  text: string
  linkText: string
  linkHref: string
}

interface CallToAction {
  text: string
  href: string
  variant: 'primary' | 'secondary'
}

interface HeroLandingProps {
  // Logo and branding
  logo?: {
    src: string
    alt: string
    companyName: string
  }
  
  // Navigation
  navigation?: NavigationItem[]
  loginText?: string
  loginHref?: string
  
  // Hero content
  title: string
  description: string
  announcementBanner?: AnnouncementBanner
  callToActions?: CallToAction[]
  
  // Styling options
  titleSize?: 'small' | 'medium' | 'large'
  gradientColors?: {
    from: string
    to: string
  }
  
  // Additional customization
  className?: string
}

const defaultProps: Partial<HeroLandingProps> = {
  logo: {
    src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
    alt: "PLUDO.AI Logo",
    companyName: "PLUDO.AI"
  },
  navigation: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Demo', href: '#demo' },
    { name: 'About', href: '#about' },
  ],
  loginText: "Sign In",
  loginHref: "/login",
  titleSize: "large",
  gradientColors: {
    from: "#D4AF37", // brand-gold
    to: "#C0C0C0"   // brand-silver
  },
  callToActions: [
    { text: "Begin Journey", href: "/signup", variant: "primary" },
    { text: "Watch Demo", href: "#demo", variant: "secondary" }
  ]
}

export function HeroLanding(props: HeroLandingProps) {
  const {
    logo,
    navigation,
    loginText,
    loginHref,
    title,
    description,
    announcementBanner,
    callToActions,
    titleSize,
    gradientColors,
    className
  } = { ...defaultProps, ...props }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()

  const getTitleSizeClasses = () => {
    switch (titleSize) {
      case 'small':
        return 'text-4xl sm:text-5xl md:text-6xl'
      case 'medium':
        return 'text-5xl sm:text-6xl md:text-7xl'
      case 'large':
      default:
        return 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
    }
  }

  const renderCallToAction = (cta: CallToAction, index: number) => {
    if (cta.variant === 'primary') {
      return (
        <Link
          key={index}
          to={cta.href}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-brand-gold to-brand-light-gold hover:from-brand-light-gold hover:to-brand-gold text-black rounded-xl shadow-lg shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all duration-300 transform hover:scale-105"
        >
          {cta.text}
        </Link>
      )
    } else {
      return (
        <Link
          key={index}
          to={cta.href}
          className="inline-flex items-center text-lg font-semibold text-brand-gold hover:text-brand-light-gold transition-colors duration-300"
        >
          {cta.text} <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      )
    }
  }

  return (
    <div className={`min-h-screen w-screen overflow-x-hidden relative bg-brand-dark ${className || ''}`}>
      {/* Luxury Background Gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 min-h-screen"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: `linear-gradient(to top right, ${gradientColors?.from}20, ${gradientColors?.to}20)`
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] min-h-screen"
        />
      </div>
      
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] min-h-screen"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: `linear-gradient(to top right, ${gradientColors?.from}15, ${gradientColors?.to}15)`
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] min-h-screen"
        />
      </div>

      {/* Fixed Navigation Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-brand-dark/90 backdrop-blur-2xl border-b border-brand-gold/20">
        <nav aria-label="Global" className="flex items-center justify-between p-4 sm:p-6 lg:px-8 h-20">
          <div className="flex lg:flex-1">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative p-3 bg-gradient-to-r from-brand-gold to-brand-light-gold rounded-2xl shadow-lg shadow-brand-gold/30 group-hover:shadow-brand-gold/50 transition-all duration-300">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-brand-gold via-brand-light-gold to-brand-gold bg-clip-text text-transparent tracking-wide">
                  {logo?.companyName}
                </span>
                <span className="text-xs text-brand-silver font-medium tracking-widest uppercase opacity-80">
                  AI Artisans
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-brand-gold transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              <Menu aria-hidden="true" className="size-6" />
            </button>
          </div>
          
          {navigation && navigation.length > 0 && (
            <div className="hidden lg:flex lg:gap-x-8 xl:gap-x-12">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="text-lg font-semibold text-gray-200 hover:text-brand-gold transition-colors duration-300 tracking-wide">
                  {item.name}
                </a>
              ))}
            </div>
          )}
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/dashboard" className="text-lg font-semibold text-gray-200 hover:text-brand-gold transition-colors duration-300">
                  Dashboard
                </Link>
                <Link to="/create" className="text-lg font-semibold text-gray-200 hover:text-brand-gold transition-colors duration-300">
                  Create Agent
                </Link>
              </div>
            ) : (
              loginText && loginHref && (
                <Link to={loginHref} className="text-lg font-semibold text-gray-200 hover:text-brand-gold transition-colors duration-300">
                  {loginText} <span aria-hidden="true">&rarr;</span>
                </Link>
              )
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 text-gray-300 hover:text-brand-gold transition-colors duration-300 rounded-xl hover:bg-brand-gold/10"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </nav>
        
        <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DialogContent className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-brand-dark px-4 py-4 sm:px-6 sm:py-6 sm:max-w-sm border-l border-brand-gold/30 lg:hidden">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-brand-gold to-brand-light-gold rounded-xl">
                  <Crown className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-brand-gold to-brand-light-gold bg-clip-text text-transparent">
                  {logo?.companyName}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-brand-gold transition-colors"
              >
                <span className="sr-only">Close menu</span>
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-brand-gold/20">
                {navigation && navigation.length > 0 && (
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-200 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
                <div className="py-6 space-y-2">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-200 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/create"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-200 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Create Agent
                      </Link>
                    </>
                  ) : (
                    loginText && loginHref && (
                      <Link
                        to={loginHref}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-200 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {loginText}
                      </Link>
                    )
                  )}
                  
                  {/* Mobile Theme Toggle */}
                  <button
                    onClick={() => {
                      toggleTheme();
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-base font-semibold text-gray-200 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                  >
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    <div className="p-2 bg-gradient-to-r from-brand-gold/20 to-brand-silver/20 rounded-lg">
                      {isDark ? (
                        <Sun className="w-5 h-5 text-brand-gold" />
                      ) : (
                        <Moon className="w-5 h-5 text-brand-silver" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {/* Hero Content with proper top padding to account for fixed header */}
      <div className="relative isolate px-6 pt-20 overflow-hidden min-h-screen flex flex-col justify-center">        
        <div className="mx-auto max-w-6xl pt-20 sm:pt-32">
          {/* Announcement banner */}
          {announcementBanner && (
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-4 py-2 text-sm text-gray-300 ring-1 ring-brand-gold/30 hover:ring-brand-gold/50 transition-all bg-brand-dark/50 backdrop-blur-sm">
                {announcementBanner.text}{' '}
                <a href={announcementBanner.linkHref} className="font-semibold text-brand-gold hover:text-brand-light-gold transition-colors">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {announcementBanner.linkText} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <h1 className={`${getTitleSizeClasses()} font-black tracking-tighter text-balance text-white leading-none mb-8`}>
              {title}
            </h1>
            <p className="mt-6 sm:mt-8 text-xl sm:text-2xl font-light text-pretty text-gray-300 sm:text-2xl/8 max-w-4xl mx-auto leading-relaxed">
              {description}
            </p>
            
            {/* Call to action buttons */}
            {callToActions && callToActions.length > 0 && (
              <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
                {callToActions.map((cta, index) => renderCallToAction(cta, index))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Export types for consumers
export type { HeroLandingProps, NavigationItem, AnnouncementBanner, CallToAction }