'use client';

import { Menu } from 'lucide-react';
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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSection, handleNavClick } = useNavigation(navItems);

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleNavClick(e, href);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="container flex h-16 items-center px-4 md:justify-start justify-end mx-auto">
        {/* Desktop Navigation */}
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

        {/* Mobile Hamburger Button */}
        <div className="fixed right-6 top-6 z-[100] md:hidden pointer-events-auto">
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
            className={cn(
              'w-full p-0 bg-black border-0 outline-none pt-24',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:duration-300 data-[state=open]:duration-500',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right'
            )}
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
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
      </div>
    </div>
  );
}
