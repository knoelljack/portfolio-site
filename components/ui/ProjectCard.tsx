'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

// Subtle dark tones — all monochromatic
const bgTones = [
  '#111111',
  '#0e0e0e',
  '#131313',
  '#0f0f0f',
  '#121212',
  '#141414',
  '#101010',
  '#0d0d0d',
  '#130f0f',
];

export function ProjectCard({ project, index }: ProjectCardProps) {
  const bg = bgTones[index % bgTones.length];
  const href = project.appStoreLinks?.apple || project.link;

  return (
    <div className="w-[560px] shrink-0 group cursor-pointer">
      <a
        href={href}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
      >
        {/* 16:10 image area */}
        <div
          className="aspect-[16/10] overflow-hidden mb-8 border border-white/5 relative"
          style={{ background: bg }}
        >
          {/* Logo or ghost first letter */}
          <div className="absolute inset-0 flex items-center justify-center">
            {project.logo ? (
              <Image
                src={project.logo}
                alt={project.title}
                width={200}
                height={80}
                className="object-contain opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                style={{ filter: 'none' }}
              />
            ) : (
              <span
                className="font-display font-extrabold leading-none tracking-tighter select-none"
                style={{ fontSize: '10rem', color: 'rgba(255,255,255,0.04)' }}
              >
                {project.title.charAt(0)}
              </span>
            )}
          </div>
          {/* Hover brightening overlay */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-all duration-700" />
        </div>

        {/* Info row */}
        <div className="flex justify-between items-end border-l border-white/20 pl-6">
          <div>
            <h3 className="font-display text-2xl font-extrabold tracking-tighter text-white group-hover:opacity-70 transition-opacity">
              {project.title.toUpperCase()}
            </h3>
            <p
              className="font-display text-[10px] uppercase tracking-widest mt-2"
              style={{ color: '#919191' }}
            >
              {project.technologies.slice(0, 2).join(' / ')}
            </p>
          </div>
          {project.comingSoon ? (
            <span
              className="font-display text-[9px] uppercase tracking-[0.3em] border border-white/20 px-3 py-1.5 mb-1"
              style={{ color: '#919191' }}
            >
              Soon
            </span>
          ) : (
            <ArrowUpRight
              className="w-7 h-7 mb-1 transition-opacity duration-300"
              style={{ color: '#ffffff', opacity: 0.25 }}
            />
          )}
        </div>
      </a>
    </div>
  );
}
