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
"[project]/src/lib/signalStore.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EVAL_WINDOW_DAYS",
    ()=>EVAL_WINDOW_DAYS,
    "evaluateDueSignals",
    ()=>evaluateDueSignals,
    "getAllSignals",
    ()=>getAllSignals,
    "logTodaysSignals",
    ()=>logTodaysSignals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redis.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/indicators.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$coingecko$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/coingecko.ts [app-route] (ecmascript)");
;
;
;
const EVAL_WINDOW_DAYS = 14;
const COINS_SET_KEY = "signals:coins";
const MOVE_THRESHOLD_PCT = 0.5; // a lean only "counts" if price moved at least this much either way
function listKey(coinId) {
    return `signals:log:${coinId}`;
}
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}
async function logTodaysSignals() {
    const coins = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$coingecko$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchCoins"])();
    const today = todayStr();
    const logged = [];
    const skipped = [];
    for (const coin of coins){
        const key = listKey(coin.id);
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].lrange(key, -1, -1);
        const last = existing[0];
        if (last?.date === today) {
            skipped.push(coin.id);
            continue;
        }
        const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeSignal"])(coin.sparkline);
        const entry = {
            date: today,
            loggedAt: new Date().toISOString(),
            coinId: coin.id,
            symbol: coin.symbol,
            priceAtLog: coin.price,
            lean: sig.lean,
            confidence: sig.confidence,
            rsi: sig.rsiValue,
            macdHistogram: sig.macdHistogram,
            macdCrossover: sig.macdCrossover,
            evaluated: false
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].rpush(key, entry);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].sadd(COINS_SET_KEY, coin.id);
        logged.push(coin.id);
    }
    return {
        logged,
        skipped
    };
}
async function evaluateDueSignals() {
    const coinIds = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].smembers(COINS_SET_KEY);
    if (!coinIds || coinIds.length === 0) return {
        evaluated: 0
    };
    const liveCoins = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$coingecko$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchCoins"])();
    const priceMap = new Map(liveCoins.map((c)=>[
            c.id,
            c
        ]));
    const cutoff = Date.now() - EVAL_WINDOW_DAYS * 24 * 60 * 60 * 1000;
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
            if (loggedTime > cutoff) continue; // not due yet
            const pctMove = (live.price - e.priceAtLog) / e.priceAtLog * 100;
            let outcome;
            if (e.lean === "neutral" || Math.abs(pctMove) < MOVE_THRESHOLD_PCT) {
                outcome = "skipped"; // no directional claim was made, or move too small to judge
            } else if (e.lean === "bullish" && pctMove > 0 || e.lean === "bearish" && pctMove < 0) {
                outcome = "correct";
            } else {
                outcome = "incorrect";
            }
            const updated = {
                ...e,
                evaluated: true,
                evaluatedAt: new Date().toISOString(),
                priceAfterWindow: live.price,
                pctMove,
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
async function getAllSignals() {
    const coinIds = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].smembers(COINS_SET_KEY);
    const byCoin = {};
    let totalLogged = 0;
    let totalEvaluated = 0;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    for (const coinId of coinIds ?? []){
        const entries = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].lrange(listKey(coinId), 0, -1);
        byCoin[coinId] = entries.reverse(); // newest first
        totalLogged += entries.length;
        for (const e of entries){
            if (!e.evaluated) continue;
            totalEvaluated++;
            if (e.outcome === "correct") correct++;
            else if (e.outcome === "incorrect") incorrect++;
            else if (e.outcome === "skipped") skipped++;
        }
    }
    const judged = correct + incorrect;
    return {
        byCoin,
        stats: {
            totalLogged,
            totalEvaluated,
            correct,
            incorrect,
            skipped,
            accuracyPct: judged > 0 ? correct / judged * 100 : null
        }
    };
}
}),
"[project]/src/app/api/signals/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$signalStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/signalStore.ts [app-route] (ecmascript)");
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
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$signalStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllSignals"])();
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

//# sourceMappingURL=%5Broot-of-the-server%5D__05mfwj6._.js.map