export type Quadrant = "adopt" | "trial" | "assess" | "hold";

export interface TechItem {
  id: string;
  name: string;
  quadrant: Quadrant;
  description: string;
  isNew?: boolean;
  githubLink?: string;
  stars?: number;
  contributors?: number;
  daysSinceLastRelease?: number;
  relatedTo?: string[];
  category?: string;
}