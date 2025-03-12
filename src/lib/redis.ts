import Redis from 'ioredis';
import logger from './logger';
import dotenv from "dotenv";

dotenv.config({path: ".env.local"});

// Initialize Redis instance with reduced retry attempts
const redis = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: 2, // Prevent excessive retries
});

console.log("Redis connection string in 'redis.ts'", process.env.REDIS_URL);

redis.on('connect', () => {
  logger.info("Connected to Redis");
});

redis.on('error', (err) => {
  logger.error(`Redis Error: ${err.message}`);
});

// Export the Redis instance
export default redis;
