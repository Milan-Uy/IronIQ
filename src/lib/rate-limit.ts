const LIMIT = 15;
const WINDOW_MS = 60_000; // 1 minute

type Entry = { count: number; windowStart: number };
const store = new Map<string, Entry>();

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = store.get(userId);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    store.set(userId, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= LIMIT) return false;

  entry.count++;
  return true;
}
