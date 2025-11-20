import fs from "fs";
import path from "path";
import https from "https";

const OUTPUT_DIR = path.join(process.cwd(), "src", "data");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const ENDPOINTS = [
    { name: "armors", url: "https://eldenring.fanapis.com/api/armors?limit=100", file: "armors.json" },
    { name: "talismans", url: "https://eldenring.fanapis.com/api/talismans?limit=100", file: "talismans.json" },
    { name: "shields", url: "https://eldenring.fanapis.com/api/shields?limit=100", file: "shields.json" },
    { name: "classes", url: "https://eldenring.fanapis.com/api/classes?limit=100", file: "classes.json" }
];

async function fetchAll(endpoint) {
    let allItems = [];
    let page = 0;
    let hasMore = true;

    console.log(`⚔️  Starting ${endpoint.name} fetch...`);

    while (hasMore) {
        const url = `${endpoint.url}&page=${page}`;
        console.log(`   [${endpoint.name}] Fetching page ${page}...`);

        try {
            const data = await new Promise((resolve, reject) => {
                https.get(url, { rejectUnauthorized: false }, (res) => {
                    let body = "";
                    res.on("data", (chunk) => body += chunk);
                    res.on("end", () => {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            reject(e);
                        }
                    });
                    res.on("error", reject);
                });
            });

            if (data.data && data.data.length > 0) {
                allItems = [...allItems, ...data.data];
                page++;
            } else {
                hasMore = false;
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint.name}:`, error);
            hasMore = false; 
        }
    }

    console.log(`✅ Fetched ${allItems.length} ${endpoint.name}.`);
    
    // Transform if needed (simplified for now, just saving raw-ish but filtered)
    // We can refine the transform later if specific UI needs arise.
    // For now, we just keep relevant fields to save space.
    const simplified = allItems.map(item => {
        // Common fields
        const base = {
            id: item.id,
            name: item.name,
            image: item.image,
            description: item.description,
            weight: item.weight || 0, // Talismans/Classes might not have weight or different structure
        };

        if (endpoint.name === "armors") {
             return {
                 ...base,
                 category: item.category,
                 dmgNegation: item.dmgNegation,
                 resistance: item.resistance
             };
        }
        
        if (endpoint.name === "talismans") {
            return {
                ...base,
                effect: item.effect
            };
        }

        if (endpoint.name === "shields") {
             return {
                 ...base,
                 category: item.category,
                 attack: item.attack,
                 defence: item.defence,
                 scalesWith: item.scalesWith,
                 requiredAttributes: item.requiredAttributes
             };
        }

        if (endpoint.name === "classes") {
             return {
                 ...base,
                 stats: item.stats
             };
        }

        return base;
    });

    fs.writeFileSync(path.join(OUTPUT_DIR, endpoint.file), JSON.stringify(simplified, null, 2));
    console.log(`💾 Saved to ${endpoint.file}`);
}

async function main() {
    for (const ep of ENDPOINTS) {
        await fetchAll(ep);
    }
}

main().catch(console.error);

