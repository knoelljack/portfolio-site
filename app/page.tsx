import { Story } from '@/components/story/Story';
import { Hero } from '@/components/sections/Hero';
import { WorkSection } from '@/components/sections/WorkSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Story>
        <Hero />
        <WorkSection />
        <AboutSection />
      </Story>
      <div className="sheet">
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
