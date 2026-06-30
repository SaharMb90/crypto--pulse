"use client";

import { useEffect, useState, useCallback } from "react";
import { Coin } from "./types";

const HOUR = 60 * 60 * 1000;

export function usePrices() {
  const [coins, setCoins] = useState<Coin[] | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "failed");
      setCoins(data.coins);
      setFetchedAt(data.fetchedAt);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, HOUR);
    return () => clearInterval(interval);
  }, [load]);

  return { coins, fetchedAt, error, loading, refresh: load };
}
