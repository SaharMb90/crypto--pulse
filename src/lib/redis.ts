// Thin wrapper around Upstash Redis REST API.
// Requires env vars UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// (set automatically if you connect the Upstash integration in Vercel,
// or copy them manually from the Upstash console into your Vercel project's
// Environment Variables).

const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function assertConfigured() {
  if (!URL || !TOKEN) {
    throw new Error(
      "Upstash Redis env vars missing. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
    );
  }
}

async function call(command: (string | number)[]) {
  assertConfigured();
  const res = await fetch(URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstash error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.result;
}

export const redis = {
  // Push a JSON-serializable value to the end of a list
  rpush: (key: string, value: unknown) => call(["RPUSH", key, JSON.stringify(value)]),
  // Get all items in a list
  lrange: async (key: string, start = 0, stop = -1) => {
    const raw = (await call(["LRANGE", key, start, stop])) as string[];
    return raw.map((r) => JSON.parse(r));
  },
  // Overwrite one item in a list by index
  lset: (key: string, index: number, value: unknown) =>
    call(["LSET", key, index, JSON.stringify(value)]),
  llen: (key: string) => call(["LLEN", key]) as Promise<number>,
  // Track distinct keys (e.g. one list per coin) in a Redis set
  sadd: (key: string, member: string) => call(["SADD", key, member]),
  smembers: (key: string) => call(["SMEMBERS", key]) as Promise<string[]>,
  isConfigured: () => Boolean(URL && TOKEN),
};
