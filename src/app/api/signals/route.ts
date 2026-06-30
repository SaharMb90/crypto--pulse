import { NextResponse } from "next/server";
import { getAllSignals } from "@/lib/signalStore";
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
    const data = await getAllSignals();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "fetch_failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}
