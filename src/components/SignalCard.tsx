"use client";

import { Coin } from "@/lib/types";
import { computeSignal } from "@/lib/indicators";
import { useLocale } from "@/lib/LocaleContext";

function Sparkline({ data, lean }: { data: number[]; lean: string }) {
  if (!data || data.length < 2) return null;
  const w = 240;
  const h = 56;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const color = lean === "bullish" ? "var(--bullish)" : lean === "bearish" ? "var(--bearish)" : "var(--text-low)";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.75" />
    </svg>
  );
}

function formatPrice(p: number) {
  return p >= 1
    ? p.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : p.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function SignalCard({ coin }: { coin: Coin }) {
  const { locale, t } = useLocale();
  const signal = computeSignal(coin.sparkline);
  const up = coin.change24h >= 0;

  const leanLabel =
    signal.lean === "bullish" ? t.signals.bullish : signal.lean === "bearish" ? t.signals.bearish : t.signals.neutral;

  const leanColor =
    signal.lean === "bullish" ? "text-bullish" : signal.lean === "bearish" ? "text-bearish" : "text-text-low";

  const confLabel =
    signal.confidence === "high" ? t.signals.high : signal.confidence === "medium" ? t.signals.medium : t.signals.low;

  return (
    <div className="bg-panel border border-hairline rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {coin.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
          )}
          <div>
            <div className="font-display font-semibold text-text-hi leading-tight">{coin.name}</div>
            <div className="text-text-low text-xs font-tabular">{coin.symbol}</div>
          </div>
        </div>
        <div className="text-end" dir="ltr">
          <div className="font-tabular text-lg font-semibold text-text-hi">${formatPrice(coin.price)}</div>
          <div className={`font-tabular text-xs ${up ? "text-bullish" : "text-bearish"}`}>
            {up ? "+" : ""}
            {coin.change24h?.toFixed(2)}%
          </div>
        </div>
      </div>

      <Sparkline data={coin.sparkline} lean={signal.lean} />

      <div className="border-t border-hairline pt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${leanColor}`}>{leanLabel}</span>
          <span className="text-xs text-text-low">
            {t.signals.confidence}: {confLabel}
          </span>
        </div>
        <div className="text-xs text-text-mid font-tabular" dir="ltr">
          {locale === "fa" ? signal.reasonFa : signal.reason}
        </div>
      </div>
    </div>
  );
}
