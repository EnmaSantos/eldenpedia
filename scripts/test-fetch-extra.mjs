import https from "https";

const fetchOne = (endpoint) => {
    const url = `https://eldenring.fanapis.com/api/${endpoint}?limit=1`;
    https.get(url, { rejectUnauthorized: false }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
            try {
                console.log(`${endpoint.toUpperCase()}:`, JSON.stringify(JSON.parse(body).data[0], null, 2));
            } catch (e) {
                console.log(`${endpoint.toUpperCase()}: Error parsing or no data`);
            }
        });
    });
};

fetchOne("shields");
fetchOne("classes");

