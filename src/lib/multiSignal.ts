import { rsi, sma, macd } from "./indicators";
import { CandleSeries, MultiTimeframeData } from "./timeframes";

export interface TimeframeRead {
  timeframe: "30m" | "1h" | "4h" | "12h";
  rsiValue: number | null;
  maSignal: "up" | "down" | "flat";
  macdSignal: "up" | "down" | "flat";
  volumeTrend: "rising" | "falling" | "flat";
  score: number; // -3..+3 contribution from this timeframe
}

function volumeTrend(volumes: number[]): "rising" | "falling" | "flat" {
  if (volumes.length < 6) return "flat";
  const recent = volumes.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const prior = volumes.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
  if (prior === 0) return "flat";
  const change = (recent - prior) / prior;
  if (change > 0.15) return "rising";
  if (change < -0.15) return "falling";
  return "flat";
}

function readTimeframe(tf: TimeframeRead["timeframe"], series: CandleSeries): TimeframeRead {
  const { closes, volumes } = series;
  const rsiValue = rsi(closes, 14);
  const s7 = sma(closes, 7);
  const s25 = sma(closes, Math.min(25, closes.length));
  const macdResult = macd(closes);
  const volTrend = volumeTrend(volumes);

  let score = 0;
  let maSignal: TimeframeRead["maSignal"] = "flat";
  if (s7 !== null && s25 !== null) {
    if (s7 > s25) {
      maSignal = "up";
      score += 1;
    } else if (s7 < s25) {
      maSignal = "down";
      score -= 1;
    }
  }

  let macdSignal: TimeframeRead["macdSignal"] = "flat";
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

  return { timeframe: tf, rsiValue, maSignal, macdSignal, volumeTrend: volTrend, score };
}

export interface MultiTimeframeSignal {
  lean: "bullish" | "bearish" | "neutral";
  // Heuristic agreement score, 0-100. NOT a statistically validated probability —
  // it only becomes a real probability once compared against the logged track record.
  heuristicConfidencePct: number;
  timeframes: TimeframeRead[];
  currentPrice: number;
  targetPrice: number; // projected 24h price if the lean plays out
  targetLow: number;
  targetHigh: number;
  expectedMovePct: number; // magnitude used for the target, e.g. 1.5
}

// Recent realized volatility (stdev of hourly returns) scaled to a 24h window,
// clamped to a 0.8%–4% band so targets stay in the "short-term scalp" range the user asked for.
function projectedMovePct(h1Closes: number[]): number {
  if (h1Closes.length < 10) return 1.5;
  const returns: number[] = [];
  for (let i = 1; i < h1Closes.length; i++) {
    returns.push((h1Closes[i] - h1Closes[i - 1]) / h1Closes[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  const hourlyStdevPct = Math.sqrt(variance) * 100;
  const projected24h = hourlyStdevPct * Math.sqrt(24);
  return Math.min(4, Math.max(0.8, projected24h));
}

export function computeMultiTimeframeSignal(
  data: MultiTimeframeData,
  currentPrice: number
): MultiTimeframeSignal {
  const reads: TimeframeRead[] = [
    readTimeframe("30m", data.m30),
    readTimeframe("1h", data.h1),
    readTimeframe("4h", data.h4),
    readTimeframe("12h", data.h12),
  ];

  // Longer timeframes weighted slightly more — a 12h trend matters more for a 24h call than a 30m blip
  const weights: Record<TimeframeRead["timeframe"], number> = { "30m": 0.8, "1h": 1, "4h": 1.2, "12h": 1.3 };
  const weightedSum = reads.reduce((acc, r) => acc + r.score * weights[r.timeframe], 0);
  const maxPossible = Object.values(weights).reduce((a, b) => a + b, 0) * 3.5; // theoretical max |score| per tf

  let lean: MultiTimeframeSignal["lean"] = "neutral";
  if (weightedSum > 1.5) lean = "bullish";
  else if (weightedSum < -1.5) lean = "bearish";

  // Agreement: what fraction of timeframes point the same direction as the overall lean
  const agreeing = reads.filter((r) =>
    lean === "bullish" ? r.score > 0 : lean === "bearish" ? r.score < 0 : r.score === 0
  ).length;
  const agreementPct = (agreeing / reads.length) * 100;
  const magnitudePct = Math.min(100, (Math.abs(weightedSum) / maxPossible) * 100);
  const heuristicConfidencePct = Math.round(agreementPct * 0.6 + magnitudePct * 0.4);

  const movePct = projectedMovePct(data.h1.closes);
  const direction = lean === "bullish" ? 1 : lean === "bearish" ? -1 : 0;
  const targetPrice = currentPrice * (1 + (direction * movePct) / 100);
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
    expectedMovePct: movePct,
  };
}
