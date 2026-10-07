import Image from 'next/image';
import type { Project } from '@/lib/types';

/** Drive Stories ships in the App Store and has no site to screenshot, so its
    frame says so in type rather than leaving an empty well. */
function Plate({ project }: { project: Project }) {
  return (
    <span className="shot-plate">
      <span className="t-label">Ships in the App Store</span>
      <span className="plate-title">{project.title}</span>
    </span>
  );
}

/**
 * One screenshot, masked so it can construct itself column by column. Lazy
 * on the calm page; the story asks for every one of them up front, since its
 * frames sit stacked in one place on the stage.
 */
export function ShotLayer({ project, sizes }: { project: Project; sizes: string }) {
  return (
    <span className="shot-layer">
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes={sizes}
          loading="lazy"
          className="object-cover object-top"
        />
      ) : (
        <Plate project={project} />
      )}
    </span>
  );
}
