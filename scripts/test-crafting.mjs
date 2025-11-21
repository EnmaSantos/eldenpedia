import https from "https";

const fetchItem = (name) => {
    const url = `https://eldenring.fanapis.com/api/items?name=${encodeURIComponent(name)}`;
    https.get(url, { rejectUnauthorized: false }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
            try {
                const data = JSON.parse(body);
                if (data.data && data.data.length > 0) {
                    console.log(`${name}:`, JSON.stringify(data.data[0], null, 2));
                } else {
                    console.log(`${name}: Not Found`);
                }
            } catch (e) {
                console.log(`${name}: Error parsing`);
            }
        });
    });
};

fetchItem("Sleep Pot");
fetchItem("Mushroom");

