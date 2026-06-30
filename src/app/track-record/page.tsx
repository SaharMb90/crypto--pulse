"use client";

import Header from "@/components/Header";
import TrackRecordView from "@/components/TrackRecordView";
import { useLocale } from "@/lib/LocaleContext";

export default function TrackRecordPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="max-w-6xl mx-auto px-5 py-10 flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-hi mb-1">{t.track.title}</h1>
          <p className="text-text-mid text-sm">{t.track.subtitle}</p>
        </div>
        <TrackRecordView />
      </main>
    </div>
  );
}
