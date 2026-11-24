export default async function handler(req, res) {
  try {
    const method = (req.query && req.query.method) || "all";
    let payTypes = [];
    if (method === "fps") payTypes = ["FPS"];
    else if (method === "bank") payTypes = ["BANK"];

    const r = await fetch("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Origin": "https://p2p.binance.com"
      },
      body: JSON.stringify({
        fiat: "HKD",
        page: 1,
        rows: 10,
        tradeType: "BUY",
        asset: "USDT",
        countries: [],
        proMerchantAds: false,
        shieldMerchantAds: false,
        filterType: "all",
        periods: [],
        additionalKycVerifyFilter: 0,
        publisherType: null,
        payTypes: payTypes,
        classifies: ["mass", "profession", "fiat_trade"]
      })
    });
    const text = await r.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
