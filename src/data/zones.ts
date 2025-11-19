export interface Zone {
  id: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  upgradeLevel: number; // Standard weapon upgrade level recommendation (+X)
  description: string;
  bosses: string[];
  mapImage?: string; 
}

export const zones: Zone[] = [
  {
    id: "limgrave-west",
    name: "Limgrave (West)",
    minLevel: 1,
    maxLevel: 15,
    upgradeLevel: 1,
    description: "The starting area. lush fields, roaming trolls, and the first step of your journey.",
    bosses: ["Tree Sentinel", "Beastman of Farum Azula", "Margit the Fell Omen (Stormveil Gate)"]
  },
  {
    id: "limgrave-east",
    name: "Limgrave (East) & Mistwood",
    minLevel: 10,
    maxLevel: 20,
    upgradeLevel: 2,
    description: "The dense forests to the east. Beware the giant bears.",
    bosses: ["Runebear", "Bloodhound Knight Darriwil"]
  },
  {
    id: "weeping-peninsula",
    name: "Weeping Peninsula",
    minLevel: 20,
    maxLevel: 30,
    upgradeLevel: 3,
    description: "South of Limgrave. A rainy, melancholic land with a large castle at the tip.",
    bosses: ["Leonine Misbegotten", "Erdtree Avatar"]
  },
  {
    id: "stormveil-castle",
    name: "Stormveil Castle",
    minLevel: 30,
    maxLevel: 40,
    upgradeLevel: 4,
    description: "The first major legacy dungeon. Home of Godrick the Grafted.",
    bosses: ["Margit, the Fell Omen", "Godrick the Grafted"]
  },
  {
    id: "liurnia-south",
    name: "Liurnia of the Lakes (South)",
    minLevel: 40,
    maxLevel: 50,
    upgradeLevel: 6,
    description: "A sinking land of magic and scholars. Enter after defeating Godrick.",
    bosses: ["Glintstone Dragon Smarag", "Adan, Thief of Fire"]
  },
  {
    id: "raya-lucaria",
    name: "Academy of Raya Lucaria",
    minLevel: 50,
    maxLevel: 60,
    upgradeLevel: 8,
    description: "The great school of sorcery. Requires a Glintstone Key to enter.",
    bosses: ["Red Wolf of Radagon", "Rennala, Queen of the Full Moon"]
  },
  {
    id: "caelid-south",
    name: "Caelid (South)",
    minLevel: 60,
    maxLevel: 70,
    upgradeLevel: 10,
    description: "A rot-infested hellscape. Do not go here early unless you want to suffer.",
    bosses: ["Commander O'Neil", "Starscourge Radahn (Festival)"]
  },
  {
    id: "altus-plateau",
    name: "Altus Plateau",
    minLevel: 60,
    maxLevel: 80,
    upgradeLevel: 12,
    description: "The golden plains leading to the capital. Accessible via the Lift of Dectus.",
    bosses: ["Elemer of the Briar", "Ancient Dragon Lansseax"]
  },
  {
    id: "leyndell",
    name: "Leyndell, Royal Capital",
    minLevel: 80,
    maxLevel: 100,
    upgradeLevel: 15,
    description: "The seat of the Erdtree. A massive maze of holy knights and secrets.",
    bosses: ["Godfrey, First Elden Lord (Shade)", "Morgott, the Omen King"]
  },
  {
    id: "mountaintops",
    name: "Mountaintops of the Giants",
    minLevel: 100,
    maxLevel: 120,
    upgradeLevel: 20,
    description: "The frozen peaks. Only accessible after defeating Morgott.",
    bosses: ["Fire Giant", "Commander Niall"]
  },
  {
    id: "farum-azula",
    name: "Crumbling Farum Azula",
    minLevel: 120,
    maxLevel: 150,
    upgradeLevel: 24,
    description: "A city suspended in time and storm. The beginning of the end.",
    bosses: ["Godskin Duo", "Maliketh, the Black Blade"]
  }
];

