/**
 * A basic in-memory rate limiter for Next.js Edge/Node environments.
 * For a distributed production environment, replace this with Upstash Redis or similar.
 */

type TokenCache = {
  count: number;
  expiresAt: number;
};

const tokenCache = new Map<string, TokenCache>();

export function rateLimit(options: { uniqueTokenPerInterval: number; interval: number }) {
  const { interval } = options;
  
  return {
    check: (limit: number, token: string) => {
      return new Promise<void>((resolve, reject) => {
        const now = Date.now();
        const tokenRecord = tokenCache.get(token);

        if (!tokenRecord || tokenRecord.expiresAt < now) {
          // New record or expired
          tokenCache.set(token, {
            count: 1,
            expiresAt: now + interval,
          });
          return resolve();
        }

        if (tokenRecord.count >= limit) {
          return reject(new Error('Rate limit exceeded'));
        }

        tokenRecord.count += 1;
        tokenCache.set(token, tokenRecord);
        return resolve();
      });
    },
  };
}
