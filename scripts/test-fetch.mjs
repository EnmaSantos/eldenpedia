import https from "https";

const url = "https://eldenring.fanapis.com/api/armors?limit=1";

https.get(url, { rejectUnauthorized: false }, (res) => {
    let body = "";
    res.on("data", (chunk) => body += chunk);
    res.on("end", () => {
        console.log("Armor:", JSON.stringify(JSON.parse(body).data[0], null, 2));
    });
});

const url2 = "https://eldenring.fanapis.com/api/talismans?limit=1";
https.get(url2, { rejectUnauthorized: false }, (res) => {
    let body = "";
    res.on("data", (chunk) => body += chunk);
    res.on("end", () => {
        console.log("Talisman:", JSON.stringify(JSON.parse(body).data[0], null, 2));
    });
});

