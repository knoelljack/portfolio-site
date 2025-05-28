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

const navItems = [
  { href: '/#home', label: 'Home' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
] as const;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('/#', '');
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="bg-black">
      <div className="container flex h-16 items-center px-4 md:justify-start justify-end">
        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link href={item.href} onClick={(e) => handleScroll(e, item.href)}>
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
                    onClick={(e) => handleScroll(e, item.href)}
                    className="nav-link-animate nav-link-border text-4xl font-medium text-white px-6 py-4 hover:bg-white/5"
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
