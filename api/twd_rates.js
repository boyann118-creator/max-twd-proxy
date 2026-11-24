export default async function handler(req, res) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "application/json"
  };

  const fetchMax = async () => {
    try {
      const r = await fetch("https://max-api.maicoin.com/api/v2/depth?market=usdttwd&limit=5", { headers });
      if (!r.ok) return { ok: false, status: r.status };
      const d = await r.json();
      const asks = (d.asks || []).map(x => parseFloat(x[0])).filter(x => x > 0).sort((a, b) => a - b);
      return asks.length ? { ok: true, price: asks[0] } : { ok: false, status: 200 };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  };

  const fetchBitoPro = async () => {
    try {
      const r = await fetch("https://api.bitopro.com/v3/tickers/usdt_twd", { headers });
      if (!r.ok) return { ok: false, status: r.status };
      const d = await r.json();
      const p = parseFloat(d?.data?.lastPrice || "0");
      return p > 0 ? { ok: true, price: p } : { ok: false, status: 200 };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  };

  const [max, bitopro] = await Promise.all([fetchMax(), fetchBitoPro()]);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(200).json({ max, bitopro });
}
