import { Coin } from "./types";

export const COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "dogecoin"];

export async function fetchCoins(): Promise<Coin[]> {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(
    ","
  )}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);

  const data = await res.json();

  return data.map((c: any) => ({
    id: c.id,
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    image: c.image,
    price: c.current_price,
    change24h: c.price_change_percentage_24h,
    sparkline: c.sparkline_in_7d?.price ?? [],
  }));
}
