// Simple in-memory token bucket rate limiter for production-level protection on sensitive routes.
// Falls back to memory-based limit to ensure robustness even when external caching servers like Redis aren't configured.

type RateLimitInfo = {
  tokens: number;
  lastRefreshed: number;
};

const rateLimitMap = new Map<string, RateLimitInfo>();

const MAX_TOKENS = 5; // Allow maximum 5 requests in burst
const REFILL_RATE_MS = 60000; // Refill 1 token every 60 seconds
const REFILL_AMOUNT = 1;

export function rateLimit(ip: string): { 
  success: boolean; 
  limit: number; 
  remaining: number; 
  reset: number; 
} {
  const now = Date.now();
  let limitInfo = rateLimitMap.get(ip);

  if (!limitInfo) {
    limitInfo = { tokens: MAX_TOKENS, lastRefreshed: now };
    rateLimitMap.set(ip, limitInfo);
  } else {
    // Refill tokens based on time passed
    const timePassed = now - limitInfo.lastRefreshed;
    if (timePassed >= REFILL_RATE_MS) {
      const tokensToAdd = Math.floor(timePassed / REFILL_RATE_MS) * REFILL_AMOUNT;
      limitInfo.tokens = Math.min(MAX_TOKENS, limitInfo.tokens + tokensToAdd);
      // Retain fractional time remainder to ensure constant refill interval
      limitInfo.lastRefreshed = now - (timePassed % REFILL_RATE_MS);
    }
  }

  if (limitInfo.tokens > 0) {
    limitInfo.tokens -= 1;
    return {
      success: true,
      limit: MAX_TOKENS,
      remaining: limitInfo.tokens,
      reset: Math.ceil((REFILL_RATE_MS - (now - limitInfo.lastRefreshed)) / 1000),
    };
  }

  return {
    success: false,
    limit: MAX_TOKENS,
    remaining: 0,
    reset: Math.ceil((REFILL_RATE_MS - (now - limitInfo.lastRefreshed)) / 1000),
  };
}
