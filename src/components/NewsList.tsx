"use client";

import { NewsItem } from "@/lib/types";
import { useLocale } from "@/lib/LocaleContext";

function timeAgo(dateStr: string | null, locale: "en" | "fa") {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return locale === "fa" ? "همین الان" : "just now";
  if (mins < 60) return locale === "fa" ? `${mins} دقیقه پیش` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return locale === "fa" ? `${hrs} ساعت پیش` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return locale === "fa" ? `${days} روز پیش` : `${days}d ago`;
}

export default function NewsList({ items }: { items: NewsItem[] }) {
  const { locale, t } = useLocale();

  return (
    <div className="flex flex-col divide-y divide-hairline">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="py-4 group flex flex-col gap-1.5 hover:bg-panel-2/50 -mx-2 px-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2 text-xs text-text-low">
            <span className="text-gold font-semibold">{item.source}</span>
            <span>·</span>
            <span dir="ltr">{timeAgo(item.pubDate, locale)}</span>
          </div>
          <div className="text-text-hi font-medium leading-snug group-hover:text-gold transition-colors">
            {item.title}
          </div>
          {item.contentSnippet && (
            <p className="text-text-mid text-sm leading-relaxed line-clamp-2">{item.contentSnippet}</p>
          )}
        </a>
      ))}
    </div>
  );
}
