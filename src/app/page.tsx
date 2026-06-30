"use client";

import Header from "@/components/Header";
import PriceTicker from "@/components/PriceTicker";
import SignalCard from "@/components/SignalCard";
import NewsList from "@/components/NewsList";
import { usePrices } from "@/lib/usePrices";
import { useNews } from "@/lib/useNews";
import { useLocale } from "@/lib/LocaleContext";

function formatTime(iso: string | null, locale: "en" | "fa") {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString(locale === "fa" ? "fa-IR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const { coins, fetchedAt, error: priceError, loading: pricesLoading } = usePrices();
  const { items: news, error: newsError, loading: newsLoading } = useNews();
  const { locale, t } = useLocale();

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <PriceTicker coins={coins} />

      <main className="max-w-6xl mx-auto px-5 py-10 flex flex-col gap-12">
        {/* Prices + Signals */}
        <section>
          <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
            <h2 className="font-display text-2xl font-bold text-text-hi">{t.signals.title}</h2>
            <span className="text-xs text-text-low font-tabular">
              {t.prices.lastUpdate}: {formatTime(fetchedAt, locale)}
            </span>
          </div>
          <p className="text-text-mid text-sm mb-6">{t.signals.subtitle}</p>

          {pricesLoading && <p className="text-text-low text-sm">{t.prices.loading}</p>}
          {priceError && <p className="text-bearish text-sm">{t.prices.error}</p>}

          {coins && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coins.map((c) => (
                <SignalCard key={c.id} coin={c} />
              ))}
            </div>
          )}

          <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-xs text-text-mid leading-relaxed">
            {t.signals.disclaimerShort}
          </div>
        </section>

        {/* News */}
        <section>
          <h2 className="font-display text-2xl font-bold text-text-hi mb-1">{t.news.title}</h2>
          <p className="text-text-mid text-sm mb-2">{t.news.subtitle}</p>

          {newsLoading && <p className="text-text-low text-sm py-4">{t.news.loading}</p>}
          {newsError && <p className="text-bearish text-sm py-4">{t.news.error}</p>}
          {news && <NewsList items={news} />}
        </section>

        {/* Disclaimer */}
        <section className="border-t border-hairline pt-8">
          <h2 className="font-display text-lg font-bold text-text-hi mb-3">{t.disclaimerPage.title}</h2>
          <div className="flex flex-col gap-3">
            {t.disclaimerPage.body.map((p, i) => (
              <p key={i} className="text-text-mid text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        <footer className="text-text-low text-xs pt-4 pb-2">{t.footer}</footer>
      </main>
    </div>
  );
}
