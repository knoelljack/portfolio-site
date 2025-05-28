'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/types';

const projects: Project[] = [
  {
    id: 1,
    title: 'Project 1',
    description: 'Description of your project 1...',
    technologies: ['React', 'TypeScript', 'Next.js'],
  },
  {
    id: 2,
    title: 'Project 2',
    description: 'Description of your project 2...',
    technologies: ['React', 'TypeScript', 'Next.js'],
  },
  {
    id: 3,
    title: 'Project 3',
    description: 'Description of your project 3...',
    technologies: ['React', 'TypeScript', 'Next.js'],
  },
];

export function ProjectsSection() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <h3 className="text-xl font-semibold mb-4">{project.title}</h3>
            <p className="text-gray-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-gray-800 rounded text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
