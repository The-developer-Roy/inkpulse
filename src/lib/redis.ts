import Redis from 'ioredis';

// Initialize Redis instance
const redis = new Redis(process.env.REDIS_URL || '');

// Export the Redis instance
export default redis;
