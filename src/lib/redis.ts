import Redis from 'ioredis';
import logger from './logger';

// Initialize Redis instance
const redis = new Redis(process.env.REDIS_URL || '');

logger.info("Connected to Redis");

// Export the Redis instance
export default redis;
