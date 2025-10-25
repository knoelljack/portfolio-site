export interface Section {
  id: string;
  title: string;
  component: React.ComponentType;
}

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

export interface ContactMethod {
  icon: string;
  title: string;
  value: string;
  description: string;
  link?: string;
}
