/**
 * The light source for the whole site.
 *
 * Glass is a refractive material — `backdrop-filter` over a flat background
 * produces nothing at all. These orbs are what every glass surface on the page
 * is actually bending and tinting, so this layer is structural rather than
 * decorative.
 *
 * Kept cheap on purpose: radial gradients are soft enough that no `filter:
 * blur()` is needed, and the drift animates `transform` only, so the whole
 * thing stays on the compositor.
 */

type Orb = {
  hue: string;
  size: string;
  top: string;
  left: string;
  opacity: number;
  animation: string;
};

const ORBS: Orb[] = [
  {
    hue: 'var(--aura-indigo)',
    size: '62vw',
    top: '-12%',
    left: '-10%',
    opacity: 0.95,
    animation: 'aura-drift-a 34s ease-in-out infinite',
  },
  {
    hue: 'var(--aura-violet)',
    size: '50vw',
    top: '18%',
    left: '44%',
    opacity: 0.8,
    animation: 'aura-drift-b 41s ease-in-out infinite',
  },
  {
    hue: 'var(--aura-indigo)',
    size: '56vw',
    top: '56%',
    left: '0%',
    opacity: 0.7,
    animation: 'aura-drift-c 47s ease-in-out infinite',
  },
  // Teal stays a thin accent — enough to keep the field from going monotone
  // violet, not enough to read as a second brand colour.
  {
    hue: 'var(--aura-teal)',
    size: '38vw',
    top: '68%',
    left: '56%',
    opacity: 0.34,
    animation: 'aura-drift-b 53s ease-in-out infinite reverse',
  },
];

export function AmbientField() {
  return (
    <div className="aura-layer" aria-hidden="true">
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="aura-orb"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            opacity: orb.opacity,
            animation: orb.animation,
            animationDelay: `${i * -7}s`,
            background: `radial-gradient(circle at 50% 50%, rgb(${orb.hue} / 0.85) 0%, rgb(${orb.hue} / 0.34) 36%, rgb(${orb.hue} / 0) 68%)`,
          }}
        />
      ))}

      {/* Vignette — pulls the field back down at the edges so the chroma
          always reads as a glow from behind, never as a flat wash. Kept light:
          crush this and the glass has nothing left to refract. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, transparent 0%, rgba(6,6,8,0.2) 60%, rgba(3,3,5,0.72) 100%)',
        }}
      />
    </div>
  );
}
