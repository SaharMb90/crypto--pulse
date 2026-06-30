// Technical indicator math used ONLY to produce an educational "lean" label.
// None of this is financial advice or a profit guarantee — see SignalCard copy.

export function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

export function rsi(values: number[], period = 14): number | null {
  if (values.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - period; i < values.length; i++) {
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

export function ema(values: number[], period: number): number[] {
  if (values.length === 0) return [];
  const k = 2 / (period + 1);
  const result: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) {
    result.push(values[i] * k + result[i - 1] * (1 - k));
  }
  return result;
}

export interface MacdResult {
  macd: number | null;
  signal: number | null;
  histogram: number | null;
  crossover: "bullish" | "bearish" | null; // histogram just flipped sign
}

// Standard 12/26/9 MACD
export function macd(values: number[], fast = 12, slow = 26, signalPeriod = 9): MacdResult {
  if (values.length < slow + signalPeriod) {
    return { macd: null, signal: null, histogram: null, crossover: null };
  }
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const macdLine = emaFast.map((v, i) => v - emaSlow[i]);
  const signalLine = ema(macdLine, signalPeriod);
  const histogram = macdLine.map((v, i) => v - signalLine[i]);

  const last = histogram[histogram.length - 1];
  const prev = histogram[histogram.length - 2];
  let crossover: MacdResult["crossover"] = null;
  if (prev !== undefined) {
    if (prev <= 0 && last > 0) crossover = "bullish";
    if (prev >= 0 && last < 0) crossover = "bearish";
  }

  return {
    macd: macdLine[macdLine.length - 1],
    signal: signalLine[signalLine.length - 1],
    histogram: last,
    crossover,
  };
}


export type Lean = "bullish" | "bearish" | "neutral";

export interface SignalResult {
  lean: Lean;
  rsiValue: number | null;
  sma7: number | null;
  sma25: number | null;
  macdHistogram: number | null;
  macdCrossover: MacdResult["crossover"];
  confidence: "low" | "medium" | "high";
  reason: string;
  reasonFa: string;
}

// Pure rule-based lean — RSI extremes + short/long SMA cross + MACD histogram/crossover.
// This is a simple heuristic combining well-known formulas, not a backtested or
// validated trading strategy, and not a profit guarantee of any kind.
export function computeSignal(prices: number[]): SignalResult {
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

  let lean: Lean = "neutral";
  if (score >= 2) lean = "bullish";
  else if (score <= -2) lean = "bearish";

  const confidence: SignalResult["confidence"] =
    Math.abs(score) >= 3 ? "high" : Math.abs(score) >= 2 ? "medium" : "low";

  const reasonParts: string[] = [];
  const reasonPartsFa: string[] = [];
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
    reasonFa: reasonPartsFa.join(" · ") || "داده کافی نیست",
  };
}
