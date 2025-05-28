'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { HamburgerButton } from '@/components/ui/hamburger-button';
import { cn } from '@/lib/utils';
import { useNavigation, type NavItem } from '@/lib/hooks/useNavigation';

const navItems: NavItem[] = [
  { id: 'home', href: '/#home', label: 'Home' },
  { id: 'about', href: '/#about', label: 'About' },
  { id: 'projects', href: '/#projects', label: 'Projects' },
  { id: 'contact', href: '/#contact', label: 'Contact' },
] as const;

// Desktop Navigation Component
function DesktopNavigation() {
  const { activeSection, handleNavClick } = useNavigation(navItems);

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'transition-all duration-300',
                activeSection === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              )}
              asChild
            >
              <Link href={item.href} onClick={(e) => handleNavClick(e, item.href)}>
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// Mobile Navigation Component
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
      <div className="md:hidden fixed right-6 top-6 z-[100]">
        <Button
          variant="ghost"
          size="icon"
          className="text-white !h-16 !w-16 !p-0 border-0 hover:bg-transparent relative"
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
          className="w-screen max-w-[100vw] h-screen p-0 bg-black border-0 outline-none pt-24 overflow-hidden"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          {/* Hamburger Button Inside Sheet */}
          <div className="fixed right-6 top-6 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="text-white !h-16 !w-16 !p-0 border-0 hover:bg-transparent relative"
              onClick={() => setIsOpen(false)}
            >
              <HamburgerButton isOpen={isOpen} />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="flex flex-col h-full">
            <div className="flex flex-col space-y-8 p-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleMobileNavClick(e, item.href)}
                  className={cn(
                    'nav-link-animate nav-link-border text-4xl font-medium px-6 py-4 transition-all duration-300',
                    activeSection === item.id
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  )}
                  data-active={isOpen}
                  style={{
                    animationDelay: `${index * 75}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Main Navbar Component
export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm w-screen max-w-[100vw]">
      <div className="flex h-16 items-center justify-between px-4 mx-auto max-w-none w-full">
        <DesktopNavigation />
        <MobileNavigation />
      </div>
    </div>
  );
}
