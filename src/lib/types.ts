export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  sparkline: number[];
}

export interface SignalLogEntry {
  date: string; // YYYY-MM-DD
  loggedAt: string; // ISO timestamp
  coinId: string;
  symbol: string;
  priceAtLog: number;
  lean: "bullish" | "bearish" | "neutral";
  confidence: "low" | "medium" | "high";
  rsi: number | null;
  macdHistogram: number | null;
  macdCrossover: "bullish" | "bearish" | null;
  evaluated: boolean;
  evaluatedAt?: string;
  priceAfterWindow?: number;
  pctMove?: number;
  outcome?: "correct" | "incorrect" | "skipped";
}

export interface PredictionEntry {
  date: string; // YYYY-MM-DD
  loggedAt: string; // ISO timestamp
  coinId: string;
  symbol: string;
  priceAtLog: number;
  lean: "bullish" | "bearish" | "neutral";
  heuristicConfidencePct: number; // formula-based, NOT a validated statistical probability
  targetPrice: number;
  expectedMovePct: number;
  timeframesSummary: string; // short human-readable summary of the 4 timeframe reads
  dataSource: "nobitex" | "coingecko_resampled";
  evaluated: boolean;
  evaluatedAt?: string;
  priceAfter24h?: number;
  actualMovePct?: number;
  outcome?: "hit" | "miss" | "skipped"; // hit = actual move reached HIT_THRESHOLD_PCT in predicted direction
}

export interface NewsItem {
  source: string;
  title: string;
  link: string;
  pubDate: string | null;
  contentSnippet: string;
}
