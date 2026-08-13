import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Limpeza periódica para não acumular IPs indefinidamente em memória.
// Processo único no Fly (min_machines_running=1), então um Map local é
// suficiente — não precisa de Redis para isso.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("fly-client-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Limitador de taxa simples em memória, por IP + ação. Usado para proteger
 * endpoints sensíveis (login, troca de senha, contato) de força bruta e spam.
 */
export async function rateLimit(
  action: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): Promise<{ success: boolean; retryAfterSeconds: number }> {
  cleanup();

  const ip = await getClientIp();
  const key = `${action}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { success: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { success: true, retryAfterSeconds: 0 };
}
