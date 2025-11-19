import { Weapon, Attribute, ScalingTier } from "@/types/weapon";

// Simplified scaling coefficients based on Elden Ring data
// S = ~1.4, A = ~1.2, B = ~1.0, C = ~0.75, D = ~0.5, E = ~0.25
const SCALING_COEFFICIENTS: Record<ScalingTier, number> = {
  "S": 1.50,
  "A": 1.25,
  "B": 1.00,
  "C": 0.75,
  "D": 0.50,
  "E": 0.25,
  "-": 0.00
};

// Soft cap logic (Simplified)
// 0-20: Low returns
// 20-50: High returns (First Soft Cap)
// 50-80: Diminishing returns (Second Soft Cap)
// 80+: Minimal returns
function getStatSaturation(statValue: number): number {
  if (statValue <= 0) return 0;
  if (statValue > 99) statValue = 99;

  // Normalized curve approximation
  if (statValue <= 20) return statValue / 80; // weak start
  if (statValue <= 50) return 0.25 + ((statValue - 20) / 30) * 0.50; // strong middle (up to 75% power)
  if (statValue <= 80) return 0.75 + ((statValue - 50) / 30) * 0.20; // taper off (up to 95% power)
  return 0.95 + ((statValue - 80) / 19) * 0.05; // hard cap crawl
}

export function calculateAR(weapon: Weapon, stats: Record<string, number>): number {
  let totalAR = 0;

  // 1. Base Damage Sum
  // (In reality, scaling applies to each damage type separately, but we'll simplify to Physical + Magic for now)
  const baseTotal = weapon.damage.physical + weapon.damage.magic + weapon.damage.fire + weapon.damage.lightning + weapon.damage.holy;
  
  // 2. Calculate Scaling Bonus
  let scalingBonus = 0;

  weapon.scaling.forEach((scale) => {
    if (scale.tier === "-") return;

    // Get the relevant user stat (e.g., "Str" -> stats.str)
    const statKey = scale.attribute.toLowerCase();
    const userStat = stats[statKey] || 0;

    // Get the coefficient for the letter grade (e.g. "B" -> 1.0)
    const letterBonus = SCALING_COEFFICIENTS[scale.tier];
    
    // Get the saturation for the stat level (e.g. 40 -> 0.65)
    const statPower = getStatSaturation(userStat);

    // Scaling Formula: BaseDamage * LetterBonus * StatPower
    // We apply this mostly to Physical for physical weapons, or split if mixed.
    // For this V1 prototype, we apply it to the Total Base Damage
    scalingBonus += baseTotal * letterBonus * statPower;
  });

  // 3. Check Requirements
  // If user doesn't meet requirements, damage is penalized heavily (usually -40%)
  let meetsReqs = true;
  weapon.requirements.forEach(req => {
     const statKey = req.attribute.toLowerCase();
     if ((stats[statKey] || 0) < req.value) {
         meetsReqs = false;
     }
  });

  if (!meetsReqs) {
      return Math.floor(baseTotal * 0.6); // 40% penalty
  }

  totalAR = baseTotal + scalingBonus;
  
  return Math.floor(totalAR);
}

