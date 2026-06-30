"use client";

import { Coin } from "@/lib/types";
import { useLocale } from "@/lib/LocaleContext";

function formatPrice(p: number) {
  return p >= 1
    ? p.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : p.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function PriceTicker({ coins }: { coins: Coin[] | null }) {
  const { locale } = useLocale();
  if (!coins || coins.length === 0) {
    return <div className="h-11 bg-panel border-y border-hairline" />;
  }

  const doubled = [...coins, ...coins];

  return (
    <div className="bg-panel border-y border-hairline overflow-hidden">
      <div className="ticker-track flex w-max" dir="ltr">
        {doubled.map((c, i) => {
          const up = c.change24h >= 0;
          return (
            <div
              key={`${c.id}-${i}`}
              className="flex items-center gap-2 px-5 py-2.5 border-r border-hairline whitespace-nowrap"
            >
              <span className="text-text-mid text-xs font-semibold">{c.symbol}</span>
              <span className="font-tabular text-sm text-text-hi">${formatPrice(c.price)}</span>
              <span
                className={`font-tabular text-xs px-1.5 py-0.5 rounded ${
                  up ? "text-bullish bg-bullish/10" : "text-bearish bg-bearish/10"
                }`}
              >
                {up ? "▲" : "▼"} {Math.abs(c.change24h).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
