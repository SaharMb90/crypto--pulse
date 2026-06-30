import { redis } from "./redis";
import { computeSignal } from "./indicators";
import { fetchCoins } from "./coingecko";
import { Coin, SignalLogEntry } from "./types";

export const EVAL_WINDOW_DAYS = 14;
const COINS_SET_KEY = "signals:coins";
const MOVE_THRESHOLD_PCT = 0.5; // a lean only "counts" if price moved at least this much either way

function listKey(coinId: string) {
  return `signals:log:${coinId}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function logTodaysSignals(): Promise<{ logged: string[]; skipped: string[] }> {
  const coins = await fetchCoins();
  const today = todayStr();
  const logged: string[] = [];
  const skipped: string[] = [];

  for (const coin of coins) {
    const key = listKey(coin.id);
    const existing = await redis.lrange(key, -1, -1);
    const last = existing[0] as SignalLogEntry | undefined;
    if (last?.date === today) {
      skipped.push(coin.id);
      continue;
    }

    const sig = computeSignal(coin.sparkline);
    const entry: SignalLogEntry = {
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
      evaluated: false,
    };

    await redis.rpush(key, entry);
    await redis.sadd(COINS_SET_KEY, coin.id);
    logged.push(coin.id);
  }

  return { logged, skipped };
}

export async function evaluateDueSignals(): Promise<{ evaluated: number }> {
  const coinIds = await redis.smembers(COINS_SET_KEY);
  if (!coinIds || coinIds.length === 0) return { evaluated: 0 };

  const liveCoins = await fetchCoins();
  const priceMap = new Map<string, Coin>(liveCoins.map((c) => [c.id, c]));

  const cutoff = Date.now() - EVAL_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  let evaluatedCount = 0;

  for (const coinId of coinIds) {
    const key = listKey(coinId);
    const entries: SignalLogEntry[] = await redis.lrange(key, 0, -1);
    const live = priceMap.get(coinId);
    if (!live) continue;

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (e.evaluated) continue;
      const loggedTime = new Date(e.loggedAt).getTime();
      if (loggedTime > cutoff) continue; // not due yet

      const pctMove = ((live.price - e.priceAtLog) / e.priceAtLog) * 100;
      let outcome: SignalLogEntry["outcome"];

      if (e.lean === "neutral" || Math.abs(pctMove) < MOVE_THRESHOLD_PCT) {
        outcome = "skipped"; // no directional claim was made, or move too small to judge
      } else if (
        (e.lean === "bullish" && pctMove > 0) ||
        (e.lean === "bearish" && pctMove < 0)
      ) {
        outcome = "correct";
      } else {
        outcome = "incorrect";
      }

      const updated: SignalLogEntry = {
        ...e,
        evaluated: true,
        evaluatedAt: new Date().toISOString(),
        priceAfterWindow: live.price,
        pctMove,
        outcome,
      };

      await redis.lset(key, i, updated);
      evaluatedCount++;
    }
  }

  return { evaluated: evaluatedCount };
}

export interface AccuracyStats {
  totalLogged: number;
  totalEvaluated: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracyPct: number | null; // correct / (correct + incorrect), null if no judged signals yet
}

export async function getAllSignals(): Promise<{
  byCoin: Record<string, SignalLogEntry[]>;
  stats: AccuracyStats;
}> {
  const coinIds = await redis.smembers(COINS_SET_KEY);
  const byCoin: Record<string, SignalLogEntry[]> = {};

  let totalLogged = 0;
  let totalEvaluated = 0;
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;

  for (const coinId of coinIds ?? []) {
    const entries: SignalLogEntry[] = await redis.lrange(listKey(coinId), 0, -1);
    byCoin[coinId] = entries.reverse(); // newest first
    totalLogged += entries.length;
    for (const e of entries) {
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
      accuracyPct: judged > 0 ? (correct / judged) * 100 : null,
    },
  };
}
