'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

// Each card gets a slightly different bloom hue so the row reads as a
// sequence rather than a repeat. All drawn from the same aura palette, and
// all seen only through glass.
const BLOOMS = [
  'var(--aura-indigo)',
  'var(--aura-violet)',
  'var(--aura-teal)',
  'var(--aura-violet)',
  'var(--aura-indigo)',
  'var(--aura-teal)',
  'var(--aura-violet)',
  'var(--aura-indigo)',
];

export function ProjectCard({ project, index }: ProjectCardProps) {
  const bloom = BLOOMS[index % BLOOMS.length];
  const href = project.appStoreLinks?.apple || project.link;

  return (
    <a
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className="w-[520px] shrink-0 group block"
    >
      <div className="glass glass-sheen glass-interactive p-4">
        {/* Logo plate */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] mb-5 bg-white/[0.03]">
          <span
            className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-70 group-hover:opacity-100"
            aria-hidden="true"
            style={{
              background: `radial-gradient(80% 70% at 50% 110%, rgb(${bloom} / 0.4) 0%, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {project.logo ? (
              <Image
                src={project.logo}
                alt={project.title}
                width={200}
                height={80}
                className="object-contain opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <span
                className="font-display font-extrabold leading-none tracking-tight select-none text-white/[0.06]"
                style={{ fontSize: '9rem' }}
              >
                {project.title.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Info row */}
        <div className="flex justify-between items-end px-2 pb-1">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              {project.title}
            </h3>
            <p className="label mt-1.5">{project.technologies.slice(0, 2).join(' · ')}</p>
          </div>
          {project.comingSoon ? (
            <span className="label px-3 py-1.5 rounded-full bg-white/[0.06]">Soon</span>
          ) : (
            <span className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] transition-all duration-500 group-hover:bg-white group-hover:scale-105">
              <ArrowUpRight className="w-4 h-4 text-white transition-colors duration-500 group-hover:text-black" />
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
