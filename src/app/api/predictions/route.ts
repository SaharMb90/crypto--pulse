import { NextResponse } from "next/server";
import { getAllPredictions, evaluateDuePredictions } from "@/lib/predictionStore";
import { redis } from "@/lib/redis";

export const revalidate = 0;

export async function GET() {
  if (!redis.isConfigured()) {
    return NextResponse.json(
      { error: "redis_not_configured", message: "Set UPSTASH_REDIS_REST_URL / TOKEN" },
      { status: 503 }
    );
  }
  try {
    // Hobby/free Vercel plans only allow daily cron frequency, but predictions
    // need a 24h check. So we opportunistically evaluate anything that's due
    // whenever this page is loaded, in addition to the daily cron safety net.
    await evaluateDuePredictions();
    const data = await getAllPredictions();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "fetch_failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}
