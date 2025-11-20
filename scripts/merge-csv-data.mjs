import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// File Paths
const JSON_FILE = path.join(process.cwd(), "src", "data", "weapons.json");
const CSV_FILE = path.join(process.cwd(), "elden_ring_weapon.csv");

// Helper to normalize names for matching (e.g. "Hand Axe" vs "Hand axe")
const normalize = (str) => str?.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

async function mergeData() {
  console.log("⚔️  Starting Data Merge...");

  // 1. Read JSON (API Data)
  if (!fs.existsSync(JSON_FILE)) {
    console.error("❌ src/data/weapons.json not found. Run fetch-weapons.mjs first.");
    return;
  }
  let jsonData = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
  console.log(`   Loaded ${jsonData.length} weapons from JSON.`);

  // 2. Read CSV (Stats Data)
  if (!fs.existsSync(CSV_FILE)) {
    console.error("❌ elden_ring_weapon.csv not found in root.");
    return;
  }
  const csvContent = fs.readFileSync(CSV_FILE, "utf8");
  const csvRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });
  console.log(`   Loaded ${csvRecords.length} weapons from CSV.`);

  let updatedCount = 0;
  let newCount = 0;

  // 3. Merge Logic
  csvRecords.forEach((csvRow) => {
    const csvName = csvRow["Name"];
    const normCsvName = normalize(csvName);
    
    // Find match in JSON
    const existingIndex = jsonData.findIndex(w => normalize(w.name) === normCsvName);

    // Extract key data from CSV
    const isSomber = csvRow["Upgrade"] === "Somber Smithing Stones";
    
    // Helper to safe parse numbers
    const num = (val) => {
        if (!val || val === "-") return 0;
        return Number(val);
    };

    // Construct the CSV-based data object (to update or create)
    const csvStats = {
      damage: {
        physical: num(csvRow["Phy"]),
        magic: num(csvRow["Mag"]),
        fire: num(csvRow["Fir"]),
        lightning: num(csvRow["Lit"]),
        holy: num(csvRow["Hol"]),
        critical: num(csvRow["Cri"]) || 100
      },
      scaling: [
        { attribute: "Str", tier: csvRow["Str"] || "-" },
        { attribute: "Dex", tier: csvRow["Dex"] || "-" },
        { attribute: "Int", tier: csvRow["Int"] || "-" },
        { attribute: "Fai", tier: csvRow["Fai"] || "-" },
        { attribute: "Arc", tier: csvRow["Arc"] || "-" }
      ],
      requirements: [
        // CSV might not have requirements in the exact format we want, 
        // but if it does (e.g. columns ReqStr, ReqDex), we'd parse them here.
        // Based on your log, it seems the CSV has simple columns.
        // If CSV lacks requirements, we keep the JSON ones or default to 0.
      ],
      weight: num(csvRow["Wgt"]),
      isSomber: isSomber,
      category: csvRow["Type"]
    };

    if (existingIndex !== -1) {
      // --- UPDATE EXISTING ---
      // We trust CSV stats more than API stats for damage/scaling
      jsonData[existingIndex].damage = csvStats.damage;
      jsonData[existingIndex].scaling = csvStats.scaling;
      jsonData[existingIndex].weight = csvStats.weight;
      jsonData[existingIndex].isSomber = csvStats.isSomber;
      // Keep JSON image, description, and requirements (unless CSV has better reqs)
      
      updatedCount++;
    } else {
      // --- CREATE NEW (DLC/Missing) ---
      const newWeapon = {
        id: normalize(csvName), // Generate simple ID
        name: csvName,
        category: csvStats.category,
        weight: csvStats.weight,
        image: "", // No image for CSV-only items yet
        description: "Data imported from spreadsheet.",
        damage: csvStats.damage,
        scaling: csvStats.scaling,
        requirements: [], // We might be missing reqs if CSV doesn't have them
        isSomber: csvStats.isSomber
      };
      jsonData.push(newWeapon);
      newCount++;
    }
  });

  console.log(`✅ Updated ${updatedCount} existing weapons.`);
  console.log(`✨ Added ${newCount} new weapons (DLC/Missing).`);
  console.log(`   Total Database Size: ${jsonData.length}`);

  // 4. Save
  fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2));
  console.log(`💾 Saved to ${JSON_FILE}`);
}

mergeData();

