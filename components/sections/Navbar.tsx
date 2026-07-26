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
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const { activeSection, handleNavClick } = useNavigation(navItems);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 250);
    return () => clearTimeout(timer);
  }, []);

  // The pill floats over both the dark sections and the light contact
  // inversion, so it has to flip material when contact passes underneath it.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const el = document.getElementById('contact');
      if (!el) return;
      const { top, bottom } = el.getBoundingClientRect();
      setOnLight(top <= 92 && bottom >= 16);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleNavClick(e, href);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* A detached pill rather than a full-width bar — it lets the
              ambient field read continuously behind and above it. */}
          <div
            className={`glass glass-sheen max-w-[1200px] mx-auto !rounded-full pl-6 pr-2 py-2 flex items-center justify-between transition-[background,box-shadow] duration-500 ${
              onLight ? 'nav-on-light' : ''
            }`}
          >
            <Link
              href="/#home"
              onClick={(e) => handleNavClick(e, '/#home')}
              className="relative z-10 font-display font-extrabold text-lg tracking-tight hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              JK.
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 relative z-10">
              {desktopNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="relative px-4 py-2 rounded-full font-display text-[13px] font-medium transition-colors duration-300"
                  style={{
                    color: activeSection === item.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'var(--nav-active-bg)',
                        boxShadow: 'inset 0 1px 0 var(--nav-active-rim)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ml-3 px-6 py-2.5 text-[13px] ${
                  onLight ? 'btn-solid-dark' : 'btn-solid'
                }`}
              >
                Resume
              </a>
            </nav>

            {/* Mobile hamburger */}
            <div className="md:hidden relative z-10">
              <Button
                variant="ghost"
                size="icon"
                className="!h-10 !w-10 !p-0 border-0 hover:bg-white/10 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                <HamburgerButton isOpen={isOpen} />
                <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              </Button>
            </div>
          </div>

          {/* Mobile sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent
              side="right"
              className="w-screen max-w-[100vw] h-screen p-0 border-0 overflow-hidden"
              style={{
                background: 'rgba(6,6,8,0.72)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                backdropFilter: 'blur(40px) saturate(180%)',
              }}
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="fixed right-7 top-7 z-50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="!h-10 !w-10 !p-0 border-0 hover:bg-white/10 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <HamburgerButton isOpen={true} />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              <nav className="flex flex-col p-8 pt-28 gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleMobileNavClick(e, item.href)}
                      className="block font-display font-extrabold text-5xl tracking-tight py-3 transition-colors"
                      style={{
                        color: activeSection === item.id ? '#ffffff' : 'var(--text-faint)',
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-solid px-10 py-4"
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
