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

function DesktopNavigation() {
  const { activeSection, handleNavClick } = useNavigation(navItems);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="hidden md:block fixed top-6 left-1/2 z-50"
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        >
          <nav className="nav-pill flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative nav-item"
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 nav-active-pill"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    activeSection === item.id ? 'text-white' : ''
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSection, handleNavClick } = useNavigation(navItems);

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleNavClick(e, href);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed right-4 top-4 z-[100]">
        <Button
          variant="ghost"
          size="icon"
          className="!h-14 !w-14 !p-0 border-0 hover:bg-transparent relative glass-card rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <HamburgerButton isOpen={isOpen} />
          <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
        </Button>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-screen max-w-[100vw] h-screen p-0 bg-[var(--background)] border-0 outline-none pt-24 overflow-hidden"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          {/* Close button */}
          <div className="fixed right-4 top-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="!h-14 !w-14 !p-0 border-0 hover:bg-transparent relative glass-card rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <HamburgerButton isOpen={isOpen} />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="flex flex-col h-full">
            <div className="flex flex-col space-y-4 p-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleMobileNavClick(e, item.href)}
                    className={`block text-4xl font-bold font-display px-6 py-4 rounded-2xl transition-all duration-300 ${
                      activeSection === item.id
                        ? 'text-gradient bg-[var(--bg-tertiary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function Navbar() {
  return (
    <>
      <DesktopNavigation />
      <MobileNavigation />
    </>
  );
}
