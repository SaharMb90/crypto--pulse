module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/redis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "redis",
    ()=>redis
]);
// Thin wrapper around Upstash Redis REST API.
// Requires env vars UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// (set automatically if you connect the Upstash integration in Vercel,
// or copy them manually from the Upstash console into your Vercel project's
// Environment Variables).
const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
function assertConfigured() {
    if (!URL || !TOKEN) {
        throw new Error("Upstash Redis env vars missing. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.");
    }
}
async function call(command) {
    assertConfigured();
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(command),
        cache: "no-store"
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upstash error ${res.status}: ${text}`);
    }
    const data = await res.json();
    return data.result;
}
const redis = {
    // Push a JSON-serializable value to the end of a list
    rpush: (key, value)=>call([
            "RPUSH",
            key,
            JSON.stringify(value)
        ]),
    // Get all items in a list
    lrange: async (key, start = 0, stop = -1)=>{
        const raw = await call([
            "LRANGE",
            key,
            start,
            stop
        ]);
        return raw.map((r)=>JSON.parse(r));
    },
    // Overwrite one item in a list by index
    lset: (key, index, value)=>call([
            "LSET",
            key,
            index,
            JSON.stringify(value)
        ]),
    llen: (key)=>call([
            "LLEN",
            key
        ]),
    // Track distinct keys (e.g. one list per coin) in a Redis set
    sadd: (key, member)=>call([
            "SADD",
            key,
            member
        ]),
    smembers: (key)=>call([
            "SMEMBERS",
            key
        ]),
    isConfigured: ()=>Boolean(URL && TOKEN)
};
}),
"[project]/src/lib/coingecko.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COINS",
    ()=>COINS,
    "fetchCoins",
    ()=>fetchCoins
]);
const COINS = [
    "bitcoin",
    "ethereum",
    "solana",
    "binancecoin",
    "ripple",
    "dogecoin"
];
async function fetchCoins() {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(",")}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;
    const res = await fetch(url, {
        headers: {
            Accept: "application/json"
        },
        cache: "no-store"
    });
    if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
    const data = await res.json();
    return data.map((c)=>({
            id: c.id,
            symbol: c.symbol.toUpperCase(),
            name: c.name,
            image: c.image,
            price: c.current_price,
            change24h: c.price_change_percentage_24h,
            sparkline: c.sparkline_in_7d?.price ?? []
        }));
}
}),
"[project]/src/lib/timeframes.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s([
    "fetchMultiTimeframeData",
    ()=>fetchMultiTimeframeData
]);
// CoinGecko id -> Nobitex USDT symbol. Only coins confirmed listed on Nobitex.
const NOBITEX_SYMBOL_MAP = {
    bitcoin: "BTCUSDT",
    ethereum: "ETHUSDT",
    solana: "SOLUSDT",
    ripple: "XRPUSDT",
    dogecoin: "DOGEUSDT"
};
const NOBITEX_BASE = "https://api.nobitex.ir";
async function fetchNobitexCandles(symbol, resolution, fromSeconds, toSeconds) {
    const url = `${NOBITEX_BASE}/market/udf/history?symbol=${symbol}&resolution=${resolution}&from=${fromSeconds}&to=${toSeconds}`;
    const res = await fetch(url, {
        headers: {
            Accept: "application/json"
        },
        cache: "no-store"
    });
    if (!res.ok) throw new Error(`Nobitex udf/history ${res.status} for ${symbol}@${resolution}`);
    const data = await res.json();
    if (data.s !== "ok" || !Array.isArray(data.c)) {
        throw new Error(`Nobitex udf/history returned no data for ${symbol}@${resolution}`);
    }
    return {
        closes: data.c,
        volumes: data.v ?? []
    };
}
async function fetchNobitexTimeframes(symbol) {
    const now = Math.floor(Date.now() / 1000);
    const day = 24 * 60 * 60;
    const [m30, h1, h4, h12] = await Promise.all([
        fetchNobitexCandles(symbol, "30", now - 2 * day, now),
        fetchNobitexCandles(symbol, "60", now - 5 * day, now),
        fetchNobitexCandles(symbol, "240", now - 20 * day, now),
        fetchNobitexCandles(symbol, "720", now - 40 * day, now)
    ]);
    return {
        m30,
        h1,
        h4,
        h12,
        source: "nobitex"
    };
}
async function fetchCoinGeckoMarketChart(coinId, days) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
    const res = await fetch(url, {
        headers: {
            Accept: "application/json"
        },
        cache: "no-store"
    });
    if (!res.ok) throw new Error(`CoinGecko market_chart ${res.status} for ${coinId}`);
    const data = await res.json();
    const prices = data.prices ?? [];
    const volumes = data.total_volumes ?? [];
    const volByT = new Map(volumes.map(([t, v])=>[
            t,
            v
        ]));
    return prices.map(([t, price])=>({
            t,
            price,
            volume: volByT.get(t) ?? 0
        }));
}
function resample(points, bucketMs) {
    if (points.length === 0) return {
        closes: [],
        volumes: []
    };
    const buckets = new Map();
    for (const p of points){
        const bucketKey = Math.floor(p.t / bucketMs);
        const existing = buckets.get(bucketKey);
        if (!existing) buckets.set(bucketKey, {
            close: p.price,
            volume: p.volume
        });
        else {
            existing.close = p.price;
            existing.volume += p.volume;
        }
    }
    const sortedKeys = [
        ...buckets.keys()
    ].sort((a, b)=>a - b);
    return {
        closes: sortedKeys.map((k)=>buckets.get(k).close),
        volumes: sortedKeys.map((k)=>buckets.get(k).volume)
    };
}
async function fetchCoinGeckoResampledTimeframes(coinId) {
    const [fine, coarse] = await Promise.all([
        fetchCoinGeckoMarketChart(coinId, 1),
        fetchCoinGeckoMarketChart(coinId, 14)
    ]);
    return {
        m30: resample(fine, 30 * 60 * 1000),
        h1: resample(fine, 60 * 60 * 1000),
        h4: resample(coarse, 4 * 60 * 60 * 1000),
        h12: resample(coarse, 12 * 60 * 60 * 1000),
        source: "coingecko_resampled"
    };
}
async function fetchMultiTimeframeData(coinId) {
    const nobitexSymbol = NOBITEX_SYMBOL_MAP[coinId];
    if (nobitexSymbol) {
        try {
            return await fetchNobitexTimeframes(nobitexSymbol);
        } catch  {
        // Nobitex hiccup (rate limit, maintenance, network filtering edge case) — fall back rather than fail the whole prediction
        }
    }
    return fetchCoinGeckoResampledTimeframes(coinId);
}
}),
"[project]/src/lib/indicators.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Technical indicator math used ONLY to produce an educational "lean" label.
// None of this is financial advice or a profit guarantee — see SignalCard copy.
__turbopack_context__.s([
    "computeSignal",
    ()=>computeSignal,
    "ema",
    ()=>ema,
    "macd",
    ()=>macd,
    "rsi",
    ()=>rsi,
    "sma",
    ()=>sma
]);
function sma(values, period) {
    if (values.length < period) return null;
    const slice = values.slice(-period);
    return slice.reduce((a, b)=>a + b, 0) / period;
}
function rsi(values, period = 14) {
    if (values.length < period + 1) return null;
    let gains = 0;
    let losses = 0;
    for(let i = values.length - period; i < values.length; i++){
        const diff = values[i] - values[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
}
function ema(values, period) {
    if (values.length === 0) return [];
    const k = 2 / (period + 1);
    const result = [
        values[0]
    ];
    for(let i = 1; i < values.length; i++){
        result.push(values[i] * k + result[i - 1] * (1 - k));
    }
    return result;
}
function macd(values, fast = 12, slow = 26, signalPeriod = 9) {
    if (values.length < slow + signalPeriod) {
        return {
            macd: null,
            signal: null,
            histogram: null,
            crossover: null
        };
    }
    const emaFast = ema(values, fast);
    const emaSlow = ema(values, slow);
    const macdLine = emaFast.map((v, i)=>v - emaSlow[i]);
    const signalLine = ema(macdLine, signalPeriod);
    const histogram = macdLine.map((v, i)=>v - signalLine[i]);
    const last = histogram[histogram.length - 1];
    const prev = histogram[histogram.length - 2];
    let crossover = null;
    if (prev !== undefined) {
        if (prev <= 0 && last > 0) crossover = "bullish";
        if (prev >= 0 && last < 0) crossover = "bearish";
    }
    return {
        macd: macdLine[macdLine.length - 1],
        signal: signalLine[signalLine.length - 1],
        histogram: last,
        crossover
    };
}
function computeSignal(prices) {
    const rsiValue = rsi(prices, 14);
    const sma7 = sma(prices, 7);
    const sma25 = sma(prices, Math.min(25, prices.length));
    const macdResult = macd(prices);
    let score = 0;
    if (rsiValue !== null) {
        if (rsiValue < 30) score += 1; // oversold -> bullish lean
        if (rsiValue > 70) score -= 1; // overbought -> bearish lean
    }
    if (sma7 !== null && sma25 !== null) {
        if (sma7 > sma25) score += 1;
        if (sma7 < sma25) score -= 1;
    }
    if (macdResult.histogram !== null) {
        if (macdResult.histogram > 0) score += 1;
        if (macdResult.histogram < 0) score -= 1;
    }
    if (macdResult.crossover === "bullish") score += 1;
    if (macdResult.crossover === "bearish") score -= 1;
    let lean = "neutral";
    if (score >= 2) lean = "bullish";
    else if (score <= -2) lean = "bearish";
    const confidence = Math.abs(score) >= 3 ? "high" : Math.abs(score) >= 2 ? "medium" : "low";
    const reasonParts = [];
    const reasonPartsFa = [];
    if (rsiValue !== null) {
        reasonParts.push(`RSI(14) ${rsiValue.toFixed(1)}`);
        reasonPartsFa.push(`RSI(14) برابر ${rsiValue.toFixed(1)}`);
    }
    if (sma7 !== null && sma25 !== null) {
        reasonParts.push(sma7 > sma25 ? "short MA above long MA" : "short MA below long MA");
        reasonPartsFa.push(sma7 > sma25 ? "میانگین کوتاه‌مدت بالای بلندمدت" : "میانگین کوتاه‌مدت زیر بلندمدت");
    }
    if (macdResult.histogram !== null) {
        reasonParts.push(`MACD hist ${macdResult.histogram > 0 ? "+" : ""}${macdResult.histogram.toFixed(3)}`);
        reasonPartsFa.push(`هیستوگرام MACD ${macdResult.histogram.toFixed(3)}`);
    }
    if (macdResult.crossover) {
        reasonParts.push(`MACD ${macdResult.crossover} cross`);
        reasonPartsFa.push(macdResult.crossover === "bullish" ? "تقاطع صعودی MACD" : "تقاطع نزولی MACD");
    }
    return {
        lean,
        rsiValue,
        sma7,
        sma25,
        macdHistogram: macdResult.histogram,
        macdCrossover: macdResult.crossover,
        confidence,
        reason: reasonParts.join(" · ") || "Not enough data",
        reasonFa: reasonPartsFa.join(" · ") || "داده کافی نیست"
    };
}
}),
"[project]/src/lib/multiSignal.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeMultiTimeframeSignal",
    ()=>computeMultiTimeframeSignal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/indicators.ts [app-route] (ecmascript)");
;
function volumeTrend(volumes) {
    if (volumes.length < 6) return "flat";
    const recent = volumes.slice(-3).reduce((a, b)=>a + b, 0) / 3;
    const prior = volumes.slice(-6, -3).reduce((a, b)=>a + b, 0) / 3;
    if (prior === 0) return "flat";
    const change = (recent - prior) / prior;
    if (change > 0.15) return "rising";
    if (change < -0.15) return "falling";
    return "flat";
}
function readTimeframe(tf, series) {
    const { closes, volumes } = series;
    const rsiValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rsi"])(closes, 14);
    const s7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sma"])(closes, 7);
    const s25 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sma"])(closes, Math.min(25, closes.length));
    const macdResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["macd"])(closes);
    const volTrend = volumeTrend(volumes);
    let score = 0;
    let maSignal = "flat";
    if (s7 !== null && s25 !== null) {
        if (s7 > s25) {
            maSignal = "up";
            score += 1;
        } else if (s7 < s25) {
            maSignal = "down";
            score -= 1;
        }
    }
    let macdSignal = "flat";
    if (macdResult.histogram !== null) {
        if (macdResult.histogram > 0) {
            macdSignal = "up";
            score += 1;
        } else if (macdResult.histogram < 0) {
            macdSignal = "down";
            score -= 1;
        }
    }
    if (macdResult.crossover === "bullish") score += 0.5;
    if (macdResult.crossover === "bearish") score -= 0.5;
    if (rsiValue !== null) {
        if (rsiValue < 30) score += 1;
        if (rsiValue > 70) score -= 1;
    }
    // Volume confirms the move it accompanies; on its own it doesn't set direction
    if (volTrend === "rising") score += Math.sign(score) * 0.5;
    return {
        timeframe: tf,
        rsiValue,
        maSignal,
        macdSignal,
        volumeTrend: volTrend,
        score
    };
}
// Recent realized volatility (stdev of hourly returns) scaled to a 24h window,
// clamped to a 0.8%–4% band so targets stay in the "short-term scalp" range the user asked for.
function projectedMovePct(h1Closes) {
    if (h1Closes.length < 10) return 1.5;
    const returns = [];
    for(let i = 1; i < h1Closes.length; i++){
        returns.push((h1Closes[i] - h1Closes[i - 1]) / h1Closes[i - 1]);
    }
    const mean = returns.reduce((a, b)=>a + b, 0) / returns.length;
    const variance = returns.reduce((a, b)=>a + (b - mean) ** 2, 0) / returns.length;
    const hourlyStdevPct = Math.sqrt(variance) * 100;
    const projected24h = hourlyStdevPct * Math.sqrt(24);
    return Math.min(4, Math.max(0.8, projected24h));
}
function computeMultiTimeframeSignal(data, currentPrice) {
    const reads = [
        readTimeframe("30m", data.m30),
        readTimeframe("1h", data.h1),
        readTimeframe("4h", data.h4),
        readTimeframe("12h", data.h12)
    ];
    // Longer timeframes weighted slightly more — a 12h trend matters more for a 24h call than a 30m blip
    const weights = {
        "30m": 0.8,
        "1h": 1,
        "4h": 1.2,
        "12h": 1.3
    };
    const weightedSum = reads.reduce((acc, r)=>acc + r.score * weights[r.timeframe], 0);
    const maxPossible = Object.values(weights).reduce((a, b)=>a + b, 0) * 3.5; // theoretical max |score| per tf
    let lean = "neutral";
    if (weightedSum > 1.5) lean = "bullish";
    else if (weightedSum < -1.5) lean = "bearish";
    // Agreement: what fraction of timeframes point the same direction as the overall lean
    const agreeing = reads.filter((r)=>lean === "bullish" ? r.score > 0 : lean === "bearish" ? r.score < 0 : r.score === 0).length;
    const agreementPct = agreeing / reads.length * 100;
    const magnitudePct = Math.min(100, Math.abs(weightedSum) / maxPossible * 100);
    const heuristicConfidencePct = Math.round(agreementPct * 0.6 + magnitudePct * 0.4);
    const movePct = projectedMovePct(data.h1.closes);
    const direction = lean === "bullish" ? 1 : lean === "bearish" ? -1 : 0;
    const targetPrice = currentPrice * (1 + direction * movePct / 100);
    const targetLow = currentPrice * (1 - movePct / 100);
    const targetHigh = currentPrice * (1 + movePct / 100);
    return {
        lean,
        heuristicConfidencePct,
        timeframes: reads,
        currentPrice,
        targetPrice,
        targetLow,
        targetHigh,
        expectedMovePct: movePct
    };
}
}),
"[project]/src/lib/predictionStore.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HIT_THRESHOLD_PCT",
    ()=>HIT_THRESHOLD_PCT,
    "evaluateDuePredictions",
    ()=>evaluateDuePredictions,
    "getAllPredictions",
    ()=>getAllPredictions,
    "logTodaysPredictions",
    ()=>logTodaysPredictions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redis.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$coingecko$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/coingecko.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$timeframes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/timeframes.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$multiSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/multiSignal.ts [app-route] (ecmascript)");
;
;
;
;
const HIT_THRESHOLD_PCT = 1; // matches the user's "1-2% short-term profit" framing
const PREDICTIONS_SET_KEY = "predictions:coins";
function listKey(coinId) {
    return `predictions:log:${coinId}`;
}
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}
function summarize(tfSignal) {
    return tfSignal.timeframes.map((t)=>`${t.timeframe}:${t.score > 0 ? "+" : ""}${t.score.toFixed(1)}`).join(" ");
}
async function logTodaysPredictions() {
    const coins = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$coingecko$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchCoins"])();
    const today = todayStr();
    const logged = [];
    const skipped = [];
    const failed = [];
    for (const coin of coins){
        const key = listKey(coin.id);
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].lrange(key, -1, -1);
        const last = existing[0];
        if (last?.date === today) {
            skipped.push(coin.id);
            continue;
        }
        try {
            const tfData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$timeframes$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchMultiTimeframeData"])(coin.id);
            const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$multiSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeMultiTimeframeSignal"])(tfData, coin.price);
            const entry = {
                date: today,
                loggedAt: new Date().toISOString(),
                coinId: coin.id,
                symbol: coin.symbol,
                priceAtLog: coin.price,
                lean: sig.lean,
                heuristicConfidencePct: sig.heuristicConfidencePct,
                targetPrice: sig.targetPrice,
                expectedMovePct: sig.expectedMovePct,
                timeframesSummary: summarize(sig),
                dataSource: tfData.source,
                evaluated: false
            };
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].rpush(key, entry);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].sadd(PREDICTIONS_SET_KEY, coin.id);
            logged.push(coin.id);
        } catch  {
            failed.push(coin.id); // e.g. CoinGecko rate limit on the per-coin OHLC calls
        }
    }
    return {
        logged,
        skipped,
        failed
    };
}
async function evaluateDuePredictions() {
    const coinIds = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].smembers(PREDICTIONS_SET_KEY);
    if (!coinIds || coinIds.length === 0) return {
        evaluated: 0
    };
    const liveCoins = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$coingecko$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchCoins"])();
    const priceMap = new Map(liveCoins.map((c)=>[
            c.id,
            c
        ]));
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    let evaluatedCount = 0;
    for (const coinId of coinIds){
        const key = listKey(coinId);
        const entries = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].lrange(key, 0, -1);
        const live = priceMap.get(coinId);
        if (!live) continue;
        for(let i = 0; i < entries.length; i++){
            const e = entries[i];
            if (e.evaluated) continue;
            const loggedTime = new Date(e.loggedAt).getTime();
            if (loggedTime > cutoff) continue; // not 24h old yet
            const actualMovePct = (live.price - e.priceAtLog) / e.priceAtLog * 100;
            let outcome;
            if (e.lean === "neutral") {
                outcome = "skipped";
            } else if (e.lean === "bullish" && actualMovePct >= HIT_THRESHOLD_PCT || e.lean === "bearish" && actualMovePct <= -HIT_THRESHOLD_PCT) {
                outcome = "hit";
            } else {
                outcome = "miss";
            }
            const updated = {
                ...e,
                evaluated: true,
                evaluatedAt: new Date().toISOString(),
                priceAfter24h: live.price,
                actualMovePct,
                outcome
            };
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].lset(key, i, updated);
            evaluatedCount++;
        }
    }
    return {
        evaluated: evaluatedCount
    };
}
async function getAllPredictions() {
    const coinIds = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].smembers(PREDICTIONS_SET_KEY);
    const byCoin = {};
    let totalLogged = 0;
    let totalEvaluated = 0;
    let hit = 0;
    let miss = 0;
    let skipped = 0;
    for (const coinId of coinIds ?? []){
        const entries = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].lrange(listKey(coinId), 0, -1);
        byCoin[coinId] = entries.reverse();
        totalLogged += entries.length;
        for (const e of entries){
            if (!e.evaluated) continue;
            totalEvaluated++;
            if (e.outcome === "hit") hit++;
            else if (e.outcome === "miss") miss++;
            else if (e.outcome === "skipped") skipped++;
        }
    }
    const judged = hit + miss;
    return {
        byCoin,
        stats: {
            totalLogged,
            totalEvaluated,
            hit,
            miss,
            skipped,
            realizedHitRatePct: judged > 0 ? hit / judged * 100 : null
        }
    };
}
}),
"[project]/src/app/api/predictions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$predictionStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/predictionStore.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redis.ts [app-route] (ecmascript)");
;
;
;
const revalidate = 0;
async function GET() {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].isConfigured()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "redis_not_configured",
            message: "Set UPSTASH_REDIS_REST_URL / TOKEN"
        }, {
            status: 503
        });
    }
    try {
        // Hobby/free Vercel plans only allow daily cron frequency, but predictions
        // need a 24h check. So we opportunistically evaluate anything that's due
        // whenever this page is loaded, in addition to the daily cron safety net.
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$predictionStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evaluateDuePredictions"])();
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$predictionStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllPredictions"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "fetch_failed",
            message: err.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0sb-5ky._.js.map