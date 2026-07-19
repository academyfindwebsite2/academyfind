import { headers } from "next/headers";

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

// In-memory store for rate limiting (Note: in a multi-instance deployment like Vercel Serverless, 
// this is per-instance, but it still provides a solid baseline defense against aggressive spam).
const rateLimitCache = new Map<string, RateLimitEntry>();

export async function checkRateLimit(
  actionName: string,
  maxRequests: number = 7,
  windowMs: number = 60000 // 1 minute default
): Promise<{ success: boolean; message?: string }> {
  try {
    const headersList = await headers();

    // Attempt to get IP from various headers
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");

    // Fallback to a generic token if IP cannot be determined (e.g. local dev)
    const ip = forwardedFor ? forwardedFor.split(",")[0] : realIp || "unknown-ip";

    const identifier = `${actionName}:${ip}`;
    const now = Date.now();

    const entry = rateLimitCache.get(identifier);

    // If no entry or the window has expired, create a new one
    if (!entry || now > entry.resetTime) {
      rateLimitCache.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { success: true };
    }

    // If within window, check count
    if (entry.count >= maxRequests) {
      const waitSeconds = Math.ceil((entry.resetTime - now) / 1000);
      return {
        success: false,
        message: `Too many requests. Please try again in ${waitSeconds} seconds.`
      };
    }

    // Increment count
    entry.count += 1;
    rateLimitCache.set(identifier, entry);

    return { success: true };

  } catch (error) {
    // If rate limiting fails (e.g. header parsing error), we default to allowing the request 
    // so we don't accidentally block legitimate users due to a rate limiter bug.
    console.error("Rate limiting error:", error);
    return { success: true };
  }
}
