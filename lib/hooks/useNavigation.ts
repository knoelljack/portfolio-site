'use client';

import { useEffect, useState, useCallback } from 'react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export function useNavigation(navItems: NavItem[]) {
  const [activeSection, setActiveSection] = useState<string>('home');

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const sectionId = href.replace('/#', '');
      scrollToSection(sectionId);
    },
    [scrollToSection]
  );

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

    const sectionIds = new Set(navItems.map((item) => item.id));
    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

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
