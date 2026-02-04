export type AccentColor = 'coral' | 'violet' | 'tangerine';

export type ProficiencyLevel = 'Expert' | 'Advanced' | 'Intermediate' | 'Familiar';

export interface Technology {
  id: string;
  name: string;
  x: number; // percentage position (0-100)
  y: number; // percentage position (0-100)
  size: number; // scale multiplier (0.75-1.4)
  proficiency: ProficiencyLevel;
  accent: AccentColor;
}

export interface Connection {
  from: string; // technology id
  to: string; // technology id
}

export interface StarPosition {
  x: number;
  y: number;
}

export interface ConstellationMapProps {
  technologies: Technology[];
  connections: Connection[];
  className?: string;
}
