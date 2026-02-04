'use client';

import { useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useCallback, RefObject } from 'react';
import { Technology } from '../types';
import { SPRING_CONFIG } from '../constants';

interface ProximityResult {
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  getProximity: (tech: Technology) => number;
  isMobile: boolean;
  mounted: boolean;
}

export function useConstellationMouse(
  containerRef: RefObject<HTMLDivElement | null>,
  technologies: Technology[]
): ProximityResult {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [containerBounds, setContainerBounds] = useState<DOMRect | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, SPRING_CONFIG);
  const smoothY = useSpring(mouseY, SPRING_CONFIG);

  // Mark as mounted to avoid SSR/hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for mobile/touch device (only after mounted)
  useEffect(() => {
    if (!mounted) return;

    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

  // Update container bounds on resize
  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        setContainerBounds(containerRef.current.getBoundingClientRect());
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
    };
  }, [containerRef]);

  // Track mouse movement (desktop only)
  useEffect(() => {
    if (isMobile || !containerBounds) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Convert to percentage within container
      const relativeX = ((e.clientX - containerBounds.left) / containerBounds.width) * 100;
      const relativeY = ((e.clientY - containerBounds.top) / containerBounds.height) * 100;

      mouseX.set(relativeX);
      mouseY.set(relativeY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, containerBounds, mouseX, mouseY]);

  // Calculate proximity (0-1) based on distance from mouse to star
  const getProximity = useCallback(
    (tech: Technology): number => {
      if (isMobile) return 0;

      const mx = smoothX.get();
      const my = smoothY.get();

      const dx = tech.x - mx;
      const dy = tech.y - my;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Stars within 30% radius glow brighter
      const maxDistance = 30;
      if (distance >= maxDistance) return 0;

      return 1 - distance / maxDistance;
    },
    [isMobile, smoothX, smoothY]
  );

  return {
    mouseX: smoothX,
    mouseY: smoothY,
    getProximity,
    isMobile,
    mounted,
  };
}
