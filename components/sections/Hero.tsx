import { ArrowUpRight } from 'lucide-react';
import { HeroName } from './HeroName';

export function Hero() {
  return (
    <header id="top" className="scene scene-hero shell" data-scene="top">
      <div className="hero-body">
        <p className="hero-role t-label" data-reel-in>
          Front-end engineer
        </p>
        <h1 className="hero-title">
          <HeroName />
          <span className="sr-only">Jack Knoell</span>{' '}
          <span className="hero-lede t-lede" data-reel-in>
            builds interfaces. And the systems behind them.
          </span>
        </h1>
        <div className="hero-actions" data-reel-in>
          <a href="#work" className="btn btn-solid">
            See the work
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Resume
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
