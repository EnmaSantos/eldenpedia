export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_weapon_id: string | null;
  playstyle: string | null;
  default_stats: {
    vigor?: number;
    mind?: number;
    endurance?: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    faith?: number;
    arcane?: number;
  };
  updated_at: string | null;
}
