export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  comingSoon?: boolean;
  appStoreLinks?: {
    apple?: string;
    google?: string;
  };
}
