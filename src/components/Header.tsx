"use client";

import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";

export default function Header() {
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="border-b border-hairline">
      <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display font-bold text-xl tracking-tight text-text-hi">
              {t.appName}
            </span>
            <span className="hidden sm:inline text-text-low text-xs font-tabular">v1</span>
          </Link>
          <Link
            href="/track-record"
            className="text-sm text-text-mid hover:text-gold transition-colors"
          >
            {t.track.navLabel}
          </Link>
          <Link
            href="/predictions"
            className="text-sm text-text-mid hover:text-gold transition-colors"
          >
            {t.predictions.navLabel}
          </Link>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-hairline bg-panel p-1">
          <button
            onClick={() => setLocale("fa")}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              locale === "fa" ? "bg-gold text-ink font-semibold" : "text-text-mid hover:text-text-hi"
            }`}
          >
            فارسی
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              locale === "en" ? "bg-gold text-ink font-semibold" : "text-text-mid hover:text-text-hi"
            }`}
          >
            English
          </button>
        </div>
      </div>
      <p className="max-w-6xl mx-auto px-5 pb-4 text-text-mid text-sm">{t.tagline}</p>
    </header>
  );
}
