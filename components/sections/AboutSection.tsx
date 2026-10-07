import { StackMorph } from './StackMorph';

export function AboutSection() {
  return (
    <section
      id="about"
      className="scene scene-about"
      data-scene="about"
      aria-labelledby="about-heading"
    >
      <div className="shell about-shell">
        <StackMorph
          lead={
            <header className="about-lead-block">
              <h2 id="about-heading" className="t-label">
                About
              </h2>
              <p className="t-lead">One person across the stack.</p>
              <p className="t-body">Interfaces, content models, and the APIs underneath.</p>
            </header>
          }
        />
      </div>
    </section>
  );
}
