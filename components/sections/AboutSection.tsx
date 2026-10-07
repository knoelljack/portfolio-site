import { Chapter } from './Chapter';
import { StackMorph } from './StackMorph';

export function AboutSection() {
  return (
    <section id="about" className="section shell">
      <Chapter word="About" />

      <div className="section-lead">
        <p className="t-lead">One person across the stack.</p>
        <p className="t-body">Interfaces, content models, and the APIs underneath.</p>
      </div>

      <StackMorph />
    </section>
  );
}
