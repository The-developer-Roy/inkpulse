import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import Redis from 'ioredis'; // Reuse the Redis connection from redis.ts
import logger from './logger';

const redisClient = new Redis(process.env.REDIS_URL as string);

export class RateLimiter {
    private rateLimiterInstance: RateLimiterRedis;

    constructor(points: number, duration: number) {
        this.rateLimiterInstance = new RateLimiterRedis({
            storeClient: redisClient, // Use the shared Redis connection
            keyPrefix: `rate-limit-${points}-${duration}`, // Unique prefix
            points: 10, // Number of allowed requests
            duration: 60, // Timeframe in seconds
        });
    }

    async applyLimit(key: string): Promise<{ allowed: boolean; error?: string }> {
        if (!key) {
            logger.warn("The key was invalid");
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
                logger.warn(`Rate limit exceeded for key: ${key}`);
                return { allowed: false, error: 'Too many requests. Please try again later.' };
            }

            console.error(`Unexpected error during rate limiting for key: ${key}`, error);
            logger.error(`Unexpected error during rate limiting for key: ${key}`);
            return { allowed: false, error: 'An error occurred while applying rate limiting.' };
        }
    }
}
