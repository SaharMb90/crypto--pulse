import { redis } from "./redis";
import { fetchCoins } from "./coingecko";
import { fetchMultiTimeframeData } from "./timeframes";
import { computeMultiTimeframeSignal } from "./multiSignal";
import { Coin, PredictionEntry } from "./types";

export const HIT_THRESHOLD_PCT = 1; // matches the user's "1-2% short-term profit" framing
const PREDICTIONS_SET_KEY = "predictions:coins";

function listKey(coinId: string) {
  return `predictions:log:${coinId}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function summarize(tfSignal: ReturnType<typeof computeMultiTimeframeSignal>): string {
  return tfSignal.timeframes
    .map((t) => `${t.timeframe}:${t.score > 0 ? "+" : ""}${t.score.toFixed(1)}`)
    .join(" ");
}

export async function logTodaysPredictions(): Promise<{ logged: string[]; skipped: string[]; failed: string[] }> {
  const coins = await fetchCoins();
  const today = todayStr();
  const logged: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const coin of coins) {
    const key = listKey(coin.id);
    const existing = await redis.lrange(key, -1, -1);
    const last = existing[0] as PredictionEntry | undefined;
    if (last?.date === today) {
      skipped.push(coin.id);
      continue;
    }

    try {
      const tfData = await fetchMultiTimeframeData(coin.id);
      const sig = computeMultiTimeframeSignal(tfData, coin.price);

      const entry: PredictionEntry = {
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
        evaluated: false,
      };

      await redis.rpush(key, entry);
      await redis.sadd(PREDICTIONS_SET_KEY, coin.id);
      logged.push(coin.id);
    } catch {
      failed.push(coin.id); // e.g. CoinGecko rate limit on the per-coin OHLC calls
    }
  }

  return { logged, skipped, failed };
}

export async function evaluateDuePredictions(): Promise<{ evaluated: number }> {
  const coinIds = await redis.smembers(PREDICTIONS_SET_KEY);
  if (!coinIds || coinIds.length === 0) return { evaluated: 0 };

  const liveCoins = await fetchCoins();
  const priceMap = new Map<string, Coin>(liveCoins.map((c) => [c.id, c]));

  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  let evaluatedCount = 0;

  for (const coinId of coinIds) {
    const key = listKey(coinId);
    const entries: PredictionEntry[] = await redis.lrange(key, 0, -1);
    const live = priceMap.get(coinId);
    if (!live) continue;

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (e.evaluated) continue;
      const loggedTime = new Date(e.loggedAt).getTime();
      if (loggedTime > cutoff) continue; // not 24h old yet

      const actualMovePct = ((live.price - e.priceAtLog) / e.priceAtLog) * 100;
      let outcome: PredictionEntry["outcome"];

      if (e.lean === "neutral") {
        outcome = "skipped";
      } else if (
        (e.lean === "bullish" && actualMovePct >= HIT_THRESHOLD_PCT) ||
        (e.lean === "bearish" && actualMovePct <= -HIT_THRESHOLD_PCT)
      ) {
        outcome = "hit";
      } else {
        outcome = "miss";
      }

      const updated: PredictionEntry = {
        ...e,
        evaluated: true,
        evaluatedAt: new Date().toISOString(),
        priceAfter24h: live.price,
        actualMovePct,
        outcome,
      };

      await redis.lset(key, i, updated);
      evaluatedCount++;
    }
  }

  return { evaluated: evaluatedCount };
}

export interface PredictionStats {
  totalLogged: number;
  totalEvaluated: number;
  hit: number;
  miss: number;
  skipped: number;
  // The one number that matters: real, measured hit rate from the logged history.
  // Only meaningful once totalEvaluated is reasonably large (the user asked for ~2 weeks).
  realizedHitRatePct: number | null;
}

export async function getAllPredictions(): Promise<{
  byCoin: Record<string, PredictionEntry[]>;
  stats: PredictionStats;
}> {
  const coinIds = await redis.smembers(PREDICTIONS_SET_KEY);
  const byCoin: Record<string, PredictionEntry[]> = {};

  let totalLogged = 0;
  let totalEvaluated = 0;
  let hit = 0;
  let miss = 0;
  let skipped = 0;

  for (const coinId of coinIds ?? []) {
    const entries: PredictionEntry[] = await redis.lrange(listKey(coinId), 0, -1);
    byCoin[coinId] = entries.reverse();
    totalLogged += entries.length;
    for (const e of entries) {
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
      realizedHitRatePct: judged > 0 ? (hit / judged) * 100 : null,
    },
  };
}
