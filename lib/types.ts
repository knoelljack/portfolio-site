export interface Project {
  slug: string;
  title: string;
  /** What kind of product it is — sits beside the title in the work index. */
  discipline: string;
  summary: string;
  technologies: string[];
  /** Omitted when the project has no website to screenshot. */
  image?: string;
  link: string;
  /** Overrides the default "Visit site" affordance label. */
  linkLabel?: string;
}
