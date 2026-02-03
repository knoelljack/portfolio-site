'use client';

import { HeroHeader } from '@/components/sections/HeroHeader';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <div className="relative bg-[var(--background)]">
      <section id="home">
        <HeroHeader />
      </section>

      <section id="about" className="py-24 md:py-32">
        <AboutSection />
      </section>

      <section id="projects" className="py-24 md:py-32">
        <ProjectsSection />
      </section>

      <section id="contact" className="py-24 md:py-32">
        <ContactSection />
      </section>
    </div>
  );
}
