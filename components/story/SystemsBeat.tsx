import { fitLines } from '@/lib/fit';
import { Fitted } from './Fitted';
import { Tower } from './Tower';

/* Solved at the width the reel's "Systems" card grows to. */
const SYSTEMS = fitLines(['Systems'], 0, 64);

/** The systems behind the interfaces: the stack, and who builds across it. */
export function SystemsBeat() {
  return (
    <section id="about" className="beat beat-systems" data-beat="systems" aria-label="About">
      <div className="shell systems-shell">
        <div className="systems-head">
          <Fitted as="h2" fit={SYSTEMS} label="Systems" className="systems-word" />
          <p className="systems-lead">One person across the stack.</p>
          <p className="systems-rest">Interfaces, content models, and the APIs underneath.</p>
        </div>
        <Tower />
      </div>
    </section>
  );
}
