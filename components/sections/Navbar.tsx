'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { HamburgerButton } from '@/components/ui/hamburger-button';
import { useNavigation, type NavItem } from '@/lib/hooks/useNavigation';

const navItems: NavItem[] = [
  { id: 'home', href: '/#home', label: 'Home' },
  { id: 'about', href: '/#about', label: 'About' },
  { id: 'projects', href: '/#projects', label: 'Projects' },
  { id: 'contact', href: '/#contact', label: 'Contact' },
];

const desktopNavItems = navItems.filter((item) => item.id !== 'home');

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { activeSection, handleNavClick } = useNavigation(navItems);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleNavClick(e, href);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 nav-dark ${scrolled ? 'scrolled' : ''}`}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        >
          <div className="max-w-[1440px] mx-auto px-8 py-6 flex items-center justify-between">
            {/* Wordmark */}
            <Link
              href="/#home"
              onClick={(e) => handleNavClick(e, '/#home')}
              className="font-display font-extrabold text-xl tracking-tighter text-white hover:opacity-60 transition-opacity"
            >
              JK.
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {desktopNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-display font-bold text-[11px] uppercase tracking-[0.25em] transition-colors pb-0.5"
                  style={{
                    color: activeSection === item.id ? '#ffffff' : '#888888',
                    borderBottom:
                      activeSection === item.id ? '1px solid #ffffff' : '1px solid transparent',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-7 py-2.5"
              >
                Resume
              </a>
            </nav>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="!h-10 !w-10 !p-0 border-0 hover:bg-white/10 rounded-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <HamburgerButton isOpen={isOpen} />
                <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              </Button>
            </div>
          </div>

          {/* Mobile Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent
              side="right"
              className="w-screen max-w-[100vw] h-screen p-0 border-0 overflow-hidden rounded-none"
              style={{ background: '#0a0a0a' }}
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="fixed right-6 top-5 z-50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="!h-10 !w-10 !p-0 border-0 hover:bg-white/10 rounded-none"
                  onClick={() => setIsOpen(false)}
                >
                  <HamburgerButton isOpen={true} />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              <nav className="flex flex-col p-8 pt-24 gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleMobileNavClick(e, item.href)}
                      className="block font-display font-extrabold text-5xl tracking-tighter py-3 transition-colors"
                      style={{ color: activeSection === item.id ? '#ffffff' : '#444444' }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-10 py-4"
                  >
                    Resume
                  </a>
                </motion.div>
              </nav>
            </SheetContent>
          </Sheet>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
