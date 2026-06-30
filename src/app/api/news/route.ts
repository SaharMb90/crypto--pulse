import { NextResponse } from "next/server";
import Parser from "rss-parser";

export const revalidate = 300; // cache 5 minutes

const FEEDS = [
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { name: "Cointelegraph", url: "https://cointelegraph.com/rss" },
  { name: "Decrypt", url: "https://decrypt.co/feed" },
];

const parser = new Parser();

export async function GET() {
  const results: any[] = [];

  await Promise.all(
    FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        for (const item of parsed.items.slice(0, 6)) {
          results.push({
            source: feed.name,
            title: item.title,
            link: item.link,
            pubDate: item.pubDate ?? item.isoDate ?? null,
            contentSnippet: item.contentSnippet?.slice(0, 180) ?? "",
          });
        }
      } catch {
        // skip a feed that fails (network filtering, downtime, etc.) without breaking the rest
      }
    })
  );

  results.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  if (results.length === 0) {
    return NextResponse.json(
      { error: "fetch_failed", message: "No feeds reachable" },
      { status: 502 }
    );
  }

  return NextResponse.json({ items: results.slice(0, 18), fetchedAt: new Date().toISOString() });
}
