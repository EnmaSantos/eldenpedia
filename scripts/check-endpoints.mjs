import https from "https";

https.get("https://eldenring.fanapis.com/api", { rejectUnauthorized: false }, (res) => {
    let body = "";
    res.on("data", (chunk) => body += chunk);
    res.on("end", () => {
        console.log(body);
    });
});

