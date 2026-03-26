export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  comingSoon?: boolean;
  logo?: string;
  appStoreLinks?: {
    apple?: string;
    google?: string;
  };
}
