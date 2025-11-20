export interface Stat {
  name: string;
  amount: number;
}

export interface Attribute {
  name: string;
  amount: number;
}

export interface Scaling {
  name: string;
  scaling: string;
}

export interface Armor {
  id: string;
  name: string;
  image: string;
  description: string;
  weight: number;
  category: string;
  dmgNegation: Stat[];
  resistance: Stat[];
}

export interface Talisman {
  id: string;
  name: string;
  image: string;
  description: string;
  weight?: number;
  effect: string;
}

export interface Shield {
  id: string;
  name: string;
  image: string;
  description: string;
  weight: number;
  category: string;
  attack: Stat[];
  defence: Stat[];
  scalesWith: Scaling[];
  requiredAttributes: Attribute[];
}

export interface Class {
  id: string;
  name: string;
  image: string;
  description: string;
  stats: {
    level: string;
    vigor: string;
    mind: string;
    endurance: string;
    strength: string;
    dexterity: string;
    intelligence: string;
    faith: string;
    arcane: string;
  };
}

