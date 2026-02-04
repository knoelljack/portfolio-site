'use client';

import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Technology, Connection, ConstellationMapProps } from './types';
import { useConstellationMouse } from './hooks/useConstellationMouse';
import { Star } from './Star';
import { ConnectionLines } from './ConnectionLines';
import { NebulaBackground } from './NebulaBackground';
import { Tooltip } from './Tooltip';
import { MobileSkillsGrid } from './MobileSkillsGrid';

export function ConstellationMap({
  technologies,
  connections,
  className,
}: ConstellationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [proximities, setProximities] = useState<Map<string, number>>(new Map());

  const { mouseX, mouseY, getProximity, isMobile, mounted } = useConstellationMouse(
    containerRef,
    technologies
  );

  // Update proximities on mouse move (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const updateProximities = () => {
      const newProximities = new Map<string, number>();
      technologies.forEach((tech) => {
        newProximities.set(tech.id, getProximity(tech));
      });
      setProximities(newProximities);
    };

    const unsubX = mouseX.on('change', updateProximities);
    const unsubY = mouseY.on('change', updateProximities);

    return () => {
      unsubX();
      unsubY();
    };
  }, [isMobile, mouseX, mouseY, technologies, getProximity]);

  // Find connected technologies for hover/select state
  const connectedIds = useMemo(() => {
    const activeId = hoveredId || selectedId;
    if (!activeId) return new Set<string>();

    const connected = new Set<string>();
    connections.forEach((conn) => {
      if (conn.from === activeId) connected.add(conn.to);
      if (conn.to === activeId) connected.add(conn.from);
    });
    return connected;
  }, [hoveredId, selectedId, connections]);

  // Get technology by ID
  const getTechById = useCallback(
    (id: string) => technologies.find((t) => t.id === id) || null,
    [technologies]
  );

  // Handle hover (desktop)
  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  // Handle click/tap
  const handleClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  // Handle mobile select
  const handleMobileSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  // Close mobile panel
  const handleClosePanel = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Click outside to deselect (desktop)
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  }, []);

  const selectedTech = selectedId ? getTechById(selectedId) : null;
  const hoveredTech = hoveredId ? getTechById(hoveredId) : null;

  return (
    <div className={cn('relative w-full h-[400px] lg:h-[450px]', className)}>
      {/* Main constellation container - clipped */}
      <motion.div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={handleContainerClick}
      >
        {/* Nebula background */}
        <NebulaBackground particleCount={isMobile ? 20 : 40} />

        {/* Mobile: Skills Grid */}
        {mounted && isMobile && isInView && (
          <MobileSkillsGrid
            technologies={technologies}
            connections={connections}
            selectedId={selectedId}
            onSelect={handleMobileSelect}
          />
        )}

        {/* Desktop: Connection lines and stars */}
        {mounted && !isMobile && (
          <>
            {/* Connection lines */}
            {isInView && (
              <ConnectionLines
                technologies={technologies}
                connections={connections}
                hoveredId={hoveredId}
                selectedId={selectedId}
              />
            )}

            {/* Stars */}
            {isInView && (
              <div className="absolute inset-0" style={{ zIndex: 10 }}>
                {technologies.map((tech, index) => (
                  <Star
                    key={tech.id}
                    tech={tech}
                    index={index}
                    isHovered={hoveredId === tech.id}
                    isConnected={connectedIds.has(tech.id)}
                    isSelected={selectedId === tech.id}
                    proximity={proximities.get(tech.id) || 0}
                    onHover={handleHover}
                    onClick={handleClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Desktop tooltip - outside clipped container */}
      {!isMobile && (hoveredTech || selectedTech) && (
        <Tooltip
          tech={hoveredTech || selectedTech}
          containerRef={containerRef}
        />
      )}
    </div>
  );
}
