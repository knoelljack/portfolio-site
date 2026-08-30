import { StackMorph } from './StackMorph';

export function AboutSection() {
  return (
    <section id="about" className="shell">
      <div className="indent pb-20 md:pb-28">
        <hr className="rule" />
        <p className="mono mt-7">About</p>

        <h2 className="t-lead duo mt-8 max-w-[30ch] md:mt-10">
          <b>One person across the stack.</b> Interfaces, content models, and the APIs underneath.
        </h2>

        <div className="mt-10 md:mt-12">
          <StackMorph />
        </div>
      </div>
    </section>
  );
}
