import { NextResponse } from "next/server";
import { fetchCoins } from "@/lib/coingecko";

export const revalidate = 60; // cache 1 minute server-side

export async function GET() {
  try {
    const coins = await fetchCoins();
    return NextResponse.json({ coins, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: "fetch_failed", message: (err as Error).message },
      { status: 502 }
    );
  }
}
