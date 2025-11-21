import fs from "fs";
import path from "path";
import https from "https";

const OUTPUT_FILE = path.join(process.cwd(), "src", "data", "items.json");
const API_URL = "https://eldenring.fanapis.com/api/items?limit=100";

async function fetchAllItems() {
  let allItems = [];
  let page = 0;
  let hasMore = true;

  console.log("🧪 Starting items fetch...");

  while (hasMore) {
    const url = `${API_URL}&page=${page}`;
    console.log(`   Fetching page ${page}...`);
    
    try {
        const data = await new Promise((resolve, reject) => {
        https.get(url, { rejectUnauthorized: false }, (res) => {
            let body = "";
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => {
                try {
                    resolve(JSON.parse(body));
                } catch(e) {
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
    } catch (err) {
        console.error("Error fetching page " + page, err);
        hasMore = false;
    }
  }

  console.log(`✅ Fetched ${allItems.length} items.`);
  
  // Simplified Transform
  const simplified = allItems.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      description: item.description,
      type: item.type,
      effect: item.effect
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(simplified, null, 2));
  console.log(`💾 Saved to ${OUTPUT_FILE}`);
}

fetchAllItems().catch(console.error);

