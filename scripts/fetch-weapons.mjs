import fs from "fs";
import path from "path";
import https from "https";

// Output path
const OUTPUT_FILE = path.join(process.cwd(), "src", "data", "weapons.json");
const API_URL = "https://eldenring.fanapis.com/api/weapons?limit=100";

async function fetchAllWeapons() {
  let allWeapons = [];
  let page = 0;
  let hasMore = true;

  console.log("⚔️  Starting weapon fetch...");

  while (hasMore) {
    const url = `${API_URL}&page=${page}`;
    console.log(`   Fetching page ${page}...`);
    
    const data = await new Promise((resolve, reject) => {
      https.get(url, { rejectUnauthorized: false }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => resolve(JSON.parse(body)));
        res.on("error", reject);
      });
    });

    if (data.data && data.data.length > 0) {
      // Transform and add
      const transformed = data.data.map(transformWeapon);
      allWeapons = [...allWeapons, ...transformed];
      page++;
    } else {
      hasMore = false;
    }
  }

  console.log(`✅ Fetched ${allWeapons.length} weapons.`);
  
  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allWeapons, null, 2));
  console.log(`💾 Saved to ${OUTPUT_FILE}`);
}

function transformWeapon(apiWeapon) {
  // Helper to safely find stat in array
  const findStat = (arr, name) => {
    const found = arr?.find(item => item.name === name);
    return found ? found.amount : 0; // API uses 'amount', sometimes string/number
  };

  // Helper to safely find scaling
  const findScaling = (arr, name) => {
    const found = arr?.find(item => item.name === name);
    return found ? found.scaling : "-";
  };

  // Map API structure to our Weapon Interface
  return {
    id: apiWeapon.id,
    name: apiWeapon.name,
    category: apiWeapon.category,
    weight: apiWeapon.weight,
    image: apiWeapon.image,
    description: apiWeapon.description,
    
    damage: {
      physical: Number(findStat(apiWeapon.attack, "Phy")) || 0,
      magic: Number(findStat(apiWeapon.attack, "Mag")) || 0,
      fire: Number(findStat(apiWeapon.attack, "Fire")) || 0,
      lightning: Number(findStat(apiWeapon.attack, "Ligt")) || 0,
      holy: Number(findStat(apiWeapon.attack, "Holy")) || 0,
      critical: Number(findStat(apiWeapon.attack, "Crit")) || 100
    },
    
    scaling: [
      { attribute: "Str", tier: findScaling(apiWeapon.scalesWith, "Str") },
      { attribute: "Dex", tier: findScaling(apiWeapon.scalesWith, "Dex") },
      { attribute: "Int", tier: findScaling(apiWeapon.scalesWith, "Int") },
      { attribute: "Fai", tier: findScaling(apiWeapon.scalesWith, "Fai") },
      { attribute: "Arc", tier: findScaling(apiWeapon.scalesWith, "Arc") }
    ],

    requirements: [
      { attribute: "Str", value: Number(findStat(apiWeapon.requiredAttributes, "Str")) || 0 },
      { attribute: "Dex", value: Number(findStat(apiWeapon.requiredAttributes, "Dex")) || 0 },
      { attribute: "Int", value: Number(findStat(apiWeapon.requiredAttributes, "Int")) || 0 },
      { attribute: "Fai", value: Number(findStat(apiWeapon.requiredAttributes, "Fai")) || 0 },
      { attribute: "Arc", value: Number(findStat(apiWeapon.requiredAttributes, "Arc")) || 0 }
    ],
    
    // Defaulting to standard for now, will enrich later
    isSomber: false 
  };
}

fetchAllWeapons().catch(console.error);

