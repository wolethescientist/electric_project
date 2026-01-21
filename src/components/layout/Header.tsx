'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Metrics', href: '/metrics' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Information', href: '/info' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  const isCurrentPage = (href: string) => pathname === href;

  return (
    <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 rounded-md p-1"
              aria-label="NEMSA Electric Meter Portal - Go to homepage"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md p-1">
                <Image
                  src="/logo.png"
                  alt="NEMSA Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold leading-tight">NEMSA Electric Meter Portal</h1>
                <p className="text-blue-200 text-sm">Safety, Quality and Efficient Service Delivery</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold">NEMSA</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav 
            id="main-navigation"
            className="hidden md:flex space-x-1" 
            role="navigation" 
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 min-h-[44px] flex items-center ${
                  isCurrentPage(item.href)
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:text-white hover:bg-blue-800'
                }`}
                aria-current={isCurrentPage(item.href) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-100 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4" id="mobile-menu">
            <nav className="flex flex-col space-y-1" role="navigation" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-3 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 min-h-[44px] flex items-center ${
                    isCurrentPage(item.href)
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:text-white hover:bg-blue-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}