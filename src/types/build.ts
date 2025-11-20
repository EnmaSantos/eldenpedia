export interface Build {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  stats: Record<string, number>;
  
  weapon_r_id: string | null;
  weapon_l_id: string | null;
  
  armor_head_id: string | null;
  armor_chest_id: string | null;
  armor_arms_id: string | null;
  armor_legs_id: string | null;
  
  talisman_1_id: string | null;
  talisman_2_id: string | null;
  talisman_3_id: string | null;
  talisman_4_id: string | null;
  
  class_id: string | null;
  
  created_at: string;
}

