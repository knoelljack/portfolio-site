'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export function useNavigation(navItems: NavItem[]) {
  const [activeSection, setActiveSection] = useState<string>('home');
  const intersectingRef = useRef<Set<string>>(new Set());

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
    const sectionOrder = navItems.map((item) => item.id);

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          intersectingRef.current.add(entry.target.id);
        } else {
          intersectingRef.current.delete(entry.target.id);
        }
      }

      // Pick the furthest-down intersecting section
      let active = '';
      for (const id of sectionOrder) {
        if (intersectingRef.current.has(id)) {
          active = id;
        }
      }
      if (active) {
        setActiveSection(active);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    for (const sectionId of sectionOrder) {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    }

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
      intersectingRef.current.clear();
    };
  }, [navItems]);

  return {
    activeSection,
    handleNavClick,
    scrollToSection,
  };
}
