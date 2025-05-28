import { HeroHeader } from '@/components/sections/HeroHeader';

export default function Home() {
  return (
    <>
      <HeroHeader />
      <section id="projects" className="min-h-screen bg-black text-white p-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Projects</h2>
          {/* Projects content */}
        </div>
      </section>
      <section id="about" className="min-h-screen bg-black text-white p-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">About</h2>
          {/* About content */}
        </div>
      </section>
      <section id="contact" className="min-h-screen bg-black text-white p-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Contact</h2>
          {/* Contact content */}
        </div>
      </section>
    </>
  );
}
