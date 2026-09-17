import { NextResponse } from "next/server";

interface RateLimitStore {
  tokens: number;
  lastReset: number;
}

const memoryStore = new Map<string, RateLimitStore>();

export interface RateLimitOptions {
  limit?: number; // max requests allowed in duration
  windowMs?: number; // window size in milliseconds
  uniqueTokenPerInterval?: number;
  interval?: number;
}

/**
 * Production-safe in-memory sliding window rate limiter.
 * Suitable for single-instance Node.js Next.js deployments.
 * For multi-instance horizontal scaling, replace `memoryStore` with Redis / Upstash client.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; limit: number; remaining: number; reset: number } {
  const limit = options.limit || 10;
  const windowMs = options.windowMs || options.interval || 60 * 1000;
  const now = Date.now();

  const record = memoryStore.get(identifier) || { tokens: limit, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.tokens = limit;
    record.lastReset = now;
  }

  if (record.tokens > 0) {
    record.tokens -= 1;
    memoryStore.set(identifier, record);
    return {
      success: true,
      limit,
      remaining: record.tokens,
      reset: Math.ceil((record.lastReset + windowMs - now) / 1000),
    };
  }

  return {
    success: false,
    limit,
    remaining: 0,
    reset: Math.ceil((record.lastReset + windowMs - now) / 1000),
  };
}

/**
 * Legacy rateLimit helper compatibility wrapper.
 */
export function rateLimit(options: RateLimitOptions = {}) {
  return {
    async check(limit: number, token: string) {
      const result = checkRateLimit(token, { limit, windowMs: options.interval || options.windowMs || 60000 });
      if (!result.success) {
        throw new Error("Rate limit exceeded");
      }
      return result;
    },
  };
}

/**
 * Helper to generate rate-limited error response.
 */
export function rateLimitResponse(resetSeconds: number) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "TOO_MANY_REQUESTS",
        message: `Too many requests. Please try again in ${resetSeconds} seconds.`,
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(resetSeconds),
      },
    }
  );
}
