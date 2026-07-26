import { HeroHeader } from '@/components/sections/HeroHeader';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  // No background colour here — the ambient field lives behind everything and
  // an opaque wrapper would hide the only thing the glass has to refract.
  return (
    <div>
      <section id="home">
        <HeroHeader />
      </section>

      <section id="about">
        <AboutSection />
      </section>

      <section id="projects">
        <ProjectsSection />
      </section>

      <section id="contact">
        <ContactSection />
      </section>

      <Footer />
    </div>
  );
}
