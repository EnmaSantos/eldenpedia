export type Attribute = "Str" | "Dex" | "Int" | "Fai" | "Arc";

export type ScalingTier = "S" | "A" | "B" | "C" | "D" | "E" | "-";

export interface Scaling {
  attribute: Attribute;
  tier: ScalingTier;
}

export interface Requirement {
  attribute: Attribute;
  value: number;
}

export interface Damage {
  physical: number;
  magic: number;
  fire: number;
  lightning: number;
  holy: number;
  critical: number;
}

export interface Weapon {
  id: string;
  name: string;
  category: string;
  weight: number;
  image: string; // URL or local path
  description: string;
  
  // Base Stats at +0
  damage: Damage;
  
  // Scaling & Requirements
  scaling: Scaling[];
  requirements: Requirement[];
  
  // Upgrade Info
  isSomber: boolean; // true = goes to +10, false = goes to +25
}

