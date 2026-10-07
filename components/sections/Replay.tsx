'use client';

/** Plays the opening reel again; the reel itself listens for the event. */
export function Replay() {
  return (
    <button
      type="button"
      className="replay"
      onClick={() => window.dispatchEvent(new Event('reel:replay'))}
    >
      Replay intro
    </button>
  );
}
