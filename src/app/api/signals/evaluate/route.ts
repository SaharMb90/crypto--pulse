import { NextResponse } from "next/server";
import { evaluateDueSignals } from "@/lib/signalStore";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!redis.isConfigured()) {
    return NextResponse.json(
      { error: "redis_not_configured", message: "Set UPSTASH_REDIS_REST_URL / TOKEN" },
      { status: 503 }
    );
  }

  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await evaluateDueSignals();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: "evaluate_failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}
