'use client';

import { HeroHeader } from '@/components/sections/HeroHeader';
import { Navbar } from '@/components/sections/Navbar';
import { Section3D } from '@/components/sections/Section3D';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { useRef } from 'react';
import type { Section } from '@/lib/types';

const sections: Section[] = [
  {
    id: 'about',
    title: 'About',
    component: AboutSection,
  },
  {
    id: 'projects',
    title: 'Projects',
    component: ProjectsSection,
  },
  {
    id: 'contact',
    title: 'Contact',
    component: ContactSection,
  },
];

export default function Home() {
  const containerRef = useRef(null);

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="carousel-container relative bg-black">
        <div id="home">
          <HeroHeader />
        </div>

        {sections.map((section) => {
          const SectionComponent = section.component;
          return (
            <Section3D key={section.id} title={section.title} id={section.id}>
              <SectionComponent />
            </Section3D>
          );
        })}
      </div>
    </>
  );
}
