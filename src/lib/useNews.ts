"use client";

import { useEffect, useState, useCallback } from "react";
import { NewsItem } from "./types";

const FIVE_MIN = 5 * 60 * 1000;

export function useNews() {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "failed");
      setItems(data.items);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, FIVE_MIN);
    return () => clearInterval(interval);
  }, [load]);

  return { items, error, loading };
}
