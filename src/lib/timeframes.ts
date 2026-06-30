// Real OHLC candles from Nobitex's public UDF-compatible market data endpoint.
// Docs: https://apidocs.nobitex.ir/ (market/udf/history)
// This gives ACTUAL candles (open/high/low/close/volume) per resolution, sourced
// from Nobitex's own order book — much closer to what you see in the Nobitex app
// than the resampled CoinGecko approximation this file used before.
//
// Caveats, stated plainly:
// - Nobitex doesn't list every coin. We only map symbols confirmed tradable there;
//   unmapped coins fall back to the old CoinGecko-resample approximation (flagged
//   in the result so you know which source was used).
// - Resolution values follow Nobitex's UDF convention (minutes as a string, or "D").
// - Nobitex candle prices are quoted against USDT pairs here (e.g. BTCUSDT), which
//   should track USD closely but is not identical to it.

export interface CandleSeries {
  closes: number[];
  volumes: number[];
}

export interface MultiTimeframeData {
  m30: CandleSeries;
  h1: CandleSeries;
  h4: CandleSeries;
  h12: CandleSeries;
  source: "nobitex" | "coingecko_resampled";
}

// CoinGecko id -> Nobitex USDT symbol. Only coins confirmed listed on Nobitex.
const NOBITEX_SYMBOL_MAP: Record<string, string> = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  solana: "SOLUSDT",
  ripple: "XRPUSDT",
  dogecoin: "DOGEUSDT",
  // binancecoin intentionally omitted — not reliably listed on Nobitex;
  // falls back to the CoinGecko-resampled path automatically.
};

const NOBITEX_BASE = "https://api.nobitex.ir";

async function fetchNobitexCandles(
  symbol: string,
  resolution: string,
  fromSeconds: number,
  toSeconds: number
): Promise<CandleSeries> {
  const url = `${NOBITEX_BASE}/market/udf/history?symbol=${symbol}&resolution=${resolution}&from=${fromSeconds}&to=${toSeconds}`;
  const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`Nobitex udf/history ${res.status} for ${symbol}@${resolution}`);
  const data = await res.json();
  if (data.s !== "ok" || !Array.isArray(data.c)) {
    throw new Error(`Nobitex udf/history returned no data for ${symbol}@${resolution}`);
  }
  return { closes: data.c as number[], volumes: (data.v as number[]) ?? [] };
}

async function fetchNobitexTimeframes(symbol: string): Promise<MultiTimeframeData> {
  const now = Math.floor(Date.now() / 1000);
  const day = 24 * 60 * 60;

  const [m30, h1, h4, h12] = await Promise.all([
    fetchNobitexCandles(symbol, "30", now - 2 * day, now), // 30-min candles, last 2 days
    fetchNobitexCandles(symbol, "60", now - 5 * day, now), // 1h candles, last 5 days
    fetchNobitexCandles(symbol, "240", now - 20 * day, now), // 4h candles, last 20 days
    fetchNobitexCandles(symbol, "720", now - 40 * day, now), // 12h candles, last 40 days
  ]);

  return { m30, h1, h4, h12, source: "nobitex" };
}

// --- Fallback path for coins not listed on Nobitex (e.g. binancecoin) ---

interface RawPoint {
  t: number;
  price: number;
  volume: number;
}

async function fetchCoinGeckoMarketChart(coinId: string, days: number): Promise<RawPoint[]> {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`CoinGecko market_chart ${res.status} for ${coinId}`);
  const data = await res.json();
  const prices: [number, number][] = data.prices ?? [];
  const volumes: [number, number][] = data.total_volumes ?? [];
  const volByT = new Map(volumes.map(([t, v]) => [t, v]));
  return prices.map(([t, price]) => ({ t, price, volume: volByT.get(t) ?? 0 }));
}

function resample(points: RawPoint[], bucketMs: number): CandleSeries {
  if (points.length === 0) return { closes: [], volumes: [] };
  const buckets = new Map<number, { close: number; volume: number }>();
  for (const p of points) {
    const bucketKey = Math.floor(p.t / bucketMs);
    const existing = buckets.get(bucketKey);
    if (!existing) buckets.set(bucketKey, { close: p.price, volume: p.volume });
    else {
      existing.close = p.price;
      existing.volume += p.volume;
    }
  }
  const sortedKeys = [...buckets.keys()].sort((a, b) => a - b);
  return {
    closes: sortedKeys.map((k) => buckets.get(k)!.close),
    volumes: sortedKeys.map((k) => buckets.get(k)!.volume),
  };
}

async function fetchCoinGeckoResampledTimeframes(coinId: string): Promise<MultiTimeframeData> {
  const [fine, coarse] = await Promise.all([
    fetchCoinGeckoMarketChart(coinId, 1),
    fetchCoinGeckoMarketChart(coinId, 14),
  ]);
  return {
    m30: resample(fine, 30 * 60 * 1000),
    h1: resample(fine, 60 * 60 * 1000),
    h4: resample(coarse, 4 * 60 * 60 * 1000),
    h12: resample(coarse, 12 * 60 * 60 * 1000),
    source: "coingecko_resampled",
  };
}

export async function fetchMultiTimeframeData(coinId: string): Promise<MultiTimeframeData> {
  const nobitexSymbol = NOBITEX_SYMBOL_MAP[coinId];
  if (nobitexSymbol) {
    try {
      return await fetchNobitexTimeframes(nobitexSymbol);
    } catch {
      // Nobitex hiccup (rate limit, maintenance, network filtering edge case) — fall back rather than fail the whole prediction
    }
  }
  return fetchCoinGeckoResampledTimeframes(coinId);
}

