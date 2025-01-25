import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import redis from './redis'; // Reuse the Redis connection from redis.ts

export class RateLimiter {
    private rateLimiterInstance: RateLimiterRedis;

    constructor(points: number, duration: number) {
        this.rateLimiterInstance = new RateLimiterRedis({
            storeClient: redis, // Use the shared Redis connection
            keyPrefix: `rate-limit-${points}-${duration}`, // Unique prefix
            points, // Number of allowed requests
            duration, // Timeframe in seconds
        });
    }

    async applyLimit(key: string): Promise<{ allowed: boolean; error?: string }> {
        if (!key) {
            return { allowed: false, error: 'Invalid key for rate limiting.' };
        }

        try {
            // Consume a point for the given key
            await this.rateLimiterInstance.consume(key);
            return { allowed: true }; // Request is allowed
        } catch (error) {
            if (error instanceof RateLimiterRes) {
                // Rate limit exceeded
                console.warn(`Rate limit exceeded for key: ${key}`);
                return { allowed: false, error: 'Too many requests. Please try again later.' };
            }

            console.error(`Unexpected error during rate limiting for key: ${key}`, error);
            return { allowed: false, error: 'An error occurred while applying rate limiting.' };
        }
    }
}
