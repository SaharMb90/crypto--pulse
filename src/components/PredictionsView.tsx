"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/LocaleContext";
import { PredictionEntry } from "@/lib/types";

interface ApiResponse {
  byCoin: Record<string, PredictionEntry[]>;
  stats: {
    totalLogged: number;
    totalEvaluated: number;
    hit: number;
    miss: number;
    skipped: number;
    realizedHitRatePct: number | null;
  };
}

function leanColor(lean: PredictionEntry["lean"]) {
  if (lean === "bullish") return "text-bullish";
  if (lean === "bearish") return "text-bearish";
  return "text-text-low";
}

function leanLabel(lean: PredictionEntry["lean"], t: any) {
  if (lean === "bullish") return t.signals.bullish;
  if (lean === "bearish") return t.signals.bearish;
  return t.signals.neutral;
}

function fmt(p: number) {
  return p.toLocaleString("en-US", { maximumFractionDigits: p < 1 ? 6 : 2 });
}

function outcomeBadge(e: PredictionEntry, t: any) {
  if (!e.evaluated) return <span className="text-xs text-text-low">{t.predictions.pending}</span>;
  if (e.outcome === "hit")
    return <span className="text-xs font-semibold text-bullish bg-bullish/10 px-2 py-0.5 rounded">{t.predictions.hit}</span>;
  if (e.outcome === "miss")
    return <span className="text-xs font-semibold text-bearish bg-bearish/10 px-2 py-0.5 rounded">{t.predictions.miss}</span>;
  return <span className="text-xs text-text-low">—</span>;
}

export default function PredictionsView() {
  const { t } = useLocale();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/predictions")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "failed");
        setData(json);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-bearish/30 bg-bearish/5 px-4 py-4 text-sm text-text-mid">
        {error.includes("redis_not_configured") || error.includes("UPSTASH") ? t.track.setupNote : error}
      </div>
    );
  }
  if (!data) return <p className="text-text-low text-sm">…</p>;

  const coinIds = Object.keys(data.byCoin);
  const hasAny = coinIds.some((id) => data.byCoin[id].length > 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-panel border border-gold/30 rounded-xl p-4 flex flex-col gap-1 col-span-2">
          <span className="text-xs text-text-low">{t.predictions.realizedLabel}</span>
          <span className="font-tabular text-3xl font-bold text-gold">
            {data.stats.realizedHitRatePct !== null ? `${data.stats.realizedHitRatePct.toFixed(0)}%` : "—"}
          </span>
          <span className="text-xs text-text-low">
            {data.stats.hit}/{data.stats.hit + data.stats.miss} {t.track.evaluated.toLowerCase()}
          </span>
        </div>
        <div className="bg-panel border border-hairline rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-text-low">{t.track.totalLogged}</span>
          <span className="font-tabular text-2xl font-bold text-text-hi">{data.stats.totalLogged}</span>
        </div>
        <div className="bg-panel border border-hairline rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-text-low">{t.track.evaluated}</span>
          <span className="font-tabular text-2xl font-bold text-text-hi">{data.stats.totalEvaluated}</span>
        </div>
      </div>

      <p className="text-xs text-text-low -mt-4">{t.predictions.threshold}</p>

      {!hasAny && <p className="text-text-low text-sm">{t.predictions.noData}</p>}

      {coinIds.map((coinId) => {
        const entries = data.byCoin[coinId];
        if (entries.length === 0) return null;
        return (
          <div key={coinId}>
            <h3 className="font-display font-semibold text-text-hi mb-1 flex items-center gap-2">
              {entries[0].symbol}
              <span
                className={`text-[10px] font-normal px-1.5 py-0.5 rounded ${
                  entries[0].dataSource === "nobitex"
                    ? "text-bullish bg-bullish/10"
                    : "text-text-low bg-text-low/10"
                }`}
              >
                {entries[0].dataSource === "nobitex" ? "Nobitex OHLC" : "CoinGecko (resampled)"}
              </span>
            </h3>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-text-low text-xs border-b border-hairline">
                    <th className="text-start py-2 pe-4 font-medium">{t.predictions.colDate}</th>
                    <th className="text-start py-2 pe-4 font-medium">{t.predictions.colLean}</th>
                    <th className="text-start py-2 pe-4 font-medium font-tabular">{t.predictions.colConfidence}</th>
                    <th className="text-start py-2 pe-4 font-medium font-tabular">{t.predictions.colPriceAtLog}</th>
                    <th className="text-start py-2 pe-4 font-medium font-tabular">{t.predictions.colTarget}</th>
                    <th className="text-start py-2 pe-4 font-medium font-tabular">{t.predictions.colPriceAfter}</th>
                    <th className="text-start py-2 pe-4 font-medium font-tabular">{t.predictions.colActualMove}</th>
                    <th className="text-start py-2 font-medium">{t.predictions.colOutcome}</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={i} className="border-b border-hairline/50">
                      <td className="py-2 pe-4 text-text-mid font-tabular">{e.date}</td>
                      <td className={`py-2 pe-4 font-medium ${leanColor(e.lean)}`}>{leanLabel(e.lean, t)}</td>
                      <td className="py-2 pe-4 font-tabular text-text-mid">{e.heuristicConfidencePct}%</td>
                      <td className="py-2 pe-4 font-tabular text-text-mid" dir="ltr">${fmt(e.priceAtLog)}</td>
                      <td className="py-2 pe-4 font-tabular text-gold" dir="ltr">${fmt(e.targetPrice)}</td>
                      <td className="py-2 pe-4 font-tabular text-text-mid" dir="ltr">
                        {e.priceAfter24h ? `$${fmt(e.priceAfter24h)}` : "—"}
                      </td>
                      <td className="py-2 pe-4 font-tabular" dir="ltr">
                        {e.actualMovePct !== undefined ? (
                          <span className={e.actualMovePct >= 0 ? "text-bullish" : "text-bearish"}>
                            {e.actualMovePct >= 0 ? "+" : ""}
                            {e.actualMovePct.toFixed(2)}%
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2">{outcomeBadge(e, t)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
