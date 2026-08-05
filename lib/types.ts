export interface Project {
  slug: string;
  title: string;
  /** What kind of product it is — sits above the title on the panel. */
  discipline: string;
  summary: string;
  technologies: string[];
  /** Brand colour as an `R G B` triple, for `rgb(var(--accent) / a)`. */
  accent: string;
  /** Deepened accent for solid fills, where the brand colour fails contrast. */
  accentUi?: string;
  /** Omitted when the project has no website to screenshot. */
  image?: string;
  link: string;
  /** Overrides the default "Visit site" affordance label. */
  linkLabel?: string;
}
