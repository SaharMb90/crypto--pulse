"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/LocaleContext";
import { SignalLogEntry } from "@/lib/types";

interface ApiResponse {
  byCoin: Record<string, SignalLogEntry[]>;
  stats: {
    totalLogged: number;
    totalEvaluated: number;
    correct: number;
    incorrect: number;
    skipped: number;
    accuracyPct: number | null;
  };
}

function leanLabel(lean: SignalLogEntry["lean"], t: any) {
  if (lean === "bullish") return t.signals.bullish;
  if (lean === "bearish") return t.signals.bearish;
  return t.signals.neutral;
}

function leanColor(lean: SignalLogEntry["lean"]) {
  if (lean === "bullish") return "text-bullish";
  if (lean === "bearish") return "text-bearish";
  return "text-text-low";
}

function outcomeBadge(e: SignalLogEntry, t: any) {
  if (!e.evaluated) {
    return <span className="text-xs text-text-low">{t.track.pending}</span>;
  }
  if (e.outcome === "correct") {
    return <span className="text-xs font-semibold text-bullish bg-bullish/10 px-2 py-0.5 rounded">{t.track.correct}</span>;
  }
  if (e.outcome === "incorrect") {
    return <span className="text-xs font-semibold text-bearish bg-bearish/10 px-2 py-0.5 rounded">{t.track.incorrect}</span>;
  }
  return <span className="text-xs text-text-low">{t.track.skipped}</span>;
}

export default function TrackRecordView() {
  const { t } = useLocale();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/signals")
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

  if (!data) {
    return <p className="text-text-low text-sm">…</p>;
  }

  const coinIds = Object.keys(data.byCoin);
  const hasAny = coinIds.some((id) => data.byCoin[id].length > 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Stat label={t.track.accuracy} value={data.stats.accuracyPct !== null ? `${data.stats.accuracyPct.toFixed(0)}%` : "—"} highlight />
        <Stat label={t.track.totalLogged} value={String(data.stats.totalLogged)} />
        <Stat label={t.track.evaluated} value={String(data.stats.totalEvaluated)} />
        <Stat label={t.track.correct} value={String(data.stats.correct)} positive />
        <Stat label={t.track.incorrect} value={String(data.stats.incorrect)} negative />
      </div>

      {!hasAny && <p className="text-text-low text-sm">{t.track.noData}</p>}

      {coinIds.map((coinId) => {
        const entries = data.byCoin[coinId];
        if (entries.length === 0) return null;
        return (
          <div key={coinId}>
            <h3 className="font-display font-semibold text-text-hi mb-3">{entries[0].symbol}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-text-low text-xs border-b border-hairline">
                    <th className="text-start py-2 pe-4 font-medium">{t.track.colDate}</th>
                    <th className="text-start py-2 pe-4 font-medium">{t.track.colLean}</th>
                    <th className="text-start py-2 pe-4 font-medium font-tabular">{t.track.colPriceAtLog}</th>
                    <th className="text-start py-2 pe-4 font-medium font-tabular">{t.track.colPriceNow}</th>
                    <th className="text-start py-2 pe-4 font-medium font-tabular">{t.track.colMove}</th>
                    <th className="text-start py-2 font-medium">{t.track.colOutcome}</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={i} className="border-b border-hairline/50">
                      <td className="py-2 pe-4 text-text-mid font-tabular">{e.date}</td>
                      <td className={`py-2 pe-4 font-medium ${leanColor(e.lean)}`}>{leanLabel(e.lean, t)}</td>
                      <td className="py-2 pe-4 font-tabular text-text-mid" dir="ltr">${e.priceAtLog.toLocaleString("en-US", { maximumFractionDigits: 4 })}</td>
                      <td className="py-2 pe-4 font-tabular text-text-mid" dir="ltr">
                        {e.priceAfterWindow ? `$${e.priceAfterWindow.toLocaleString("en-US", { maximumFractionDigits: 4 })}` : "—"}
                      </td>
                      <td className="py-2 pe-4 font-tabular" dir="ltr">
                        {e.pctMove !== undefined ? (
                          <span className={e.pctMove >= 0 ? "text-bullish" : "text-bearish"}>
                            {e.pctMove >= 0 ? "+" : ""}
                            {e.pctMove.toFixed(2)}%
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

function Stat({
  label,
  value,
  highlight,
  positive,
  negative,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="bg-panel border border-hairline rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs text-text-low">{label}</span>
      <span
        className={`font-tabular text-2xl font-bold ${
          highlight ? "text-gold" : positive ? "text-bullish" : negative ? "text-bearish" : "text-text-hi"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
