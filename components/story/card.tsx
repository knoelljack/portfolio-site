import Image from 'next/image';
import type { Project } from '@/lib/types';

/** Each project's field colour, cycling through the palette from pink: the
    orange belongs to the beats either side of the work. */
export const POSTER_COLORS = ['pink', 'teal', 'orange'] as const;
export const posterColor = (i: number) => `var(--${POSTER_COLORS[i % POSTER_COLORS.length]})`;

/** One `sizes` for every copy of a screenshot, so the calm page's cards and
    the story's shared card resolve to the same file and it loads once. */
export const CARD_SIZES = '(max-aspect-ratio: 5/4) 76vw, 36vw';

/** What a card shows: the screenshot, or for the App Store project a plate
    that says so in type rather than leaving an empty well. */
export function CardFace({ project }: { project: Project }) {
  if (!project.image) {
    return (
      <span className="plate">
        <span className="plate-note">Ships in the App Store</span>
        <span className="plate-title">{project.title}</span>
      </span>
    );
  }
  return (
    <Image src={project.image} alt="" fill sizes={CARD_SIZES} className="object-cover object-top" />
  );
}
