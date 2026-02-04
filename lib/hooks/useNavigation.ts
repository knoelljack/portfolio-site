'use client';

import { useEffect, useState, useCallback } from 'react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export function useNavigation(navItems: NavItem[]) {
  const [activeSection, setActiveSection] = useState<string>('home');

  // Immediate scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo(0, element.offsetTop);
    }
  }, []);

  // Handle navigation click
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const sectionId = href.replace('/#', '');
      scrollToSection(sectionId);
    },
    [scrollToSection]
  );

  // Track active section based on scroll position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = ['home', ...navItems.map((item) => item.id)];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Handle edge case: activate last section when scrolled to bottom
    const lastSectionId = navItems[navItems.length - 1]?.id;
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (scrolledToBottom && lastSectionId) {
        setActiveSection(lastSectionId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navItems]);

  return {
    activeSection,
    handleNavClick,
    scrollToSection,
  };
}
