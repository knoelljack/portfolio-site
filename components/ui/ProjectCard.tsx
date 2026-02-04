'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const gradientColors = [
  'from-violet-500/20 to-fuchsia-500/20',
  'from-coral-500/20 to-orange-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-rose-500/20 to-pink-500/20',
  'from-amber-500/20 to-yellow-500/20',
  'from-indigo-500/20 to-purple-500/20',
];

export function ProjectCard({ project, index }: ProjectCardProps) {
  const gradientClass = gradientColors[index % gradientColors.length];
  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      className="scroll-card w-[400px] md:w-[500px] relative h-full"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Project number watermark */}
      <span className="project-number font-display">{projectNumber}</span>

      {/* Browser mockup card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-lg overflow-hidden border border-[var(--glass-border)] h-full flex flex-col">
        {/* Browser chrome */}
        <div className="browser-chrome">
          <div className="flex gap-2">
            <div className="traffic-light traffic-light-red" />
            <div className="traffic-light traffic-light-yellow" />
            <div className="traffic-light traffic-light-green" />
          </div>
          <div className="url-bar">
            {project.link ? new URL(project.link).hostname : 'localhost:3000'}
          </div>
        </div>

        {/* Gradient preview area */}
        <motion.div
          className={`h-48 bg-gradient-to-br ${gradientClass} relative overflow-hidden`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-white/10 font-display">
              {project.title.charAt(0)}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 font-display">
            {project.title}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[4.5rem] content-start">
            {project.technologies.slice(0, 5).map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="tech-tag">+{project.technologies.length - 5}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-auto pt-2">
            {project.comingSoon ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium">
                Coming Soon
              </span>
            ) : null}

            {project.appStoreLinks?.apple && (
              <a
                href={project.appStoreLinks.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--text-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
            )}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              >
                View Site
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
