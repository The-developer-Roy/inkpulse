import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
    try {
        // Example Redis operation
        await redis.set("test-key", "Hello, Redis!");
        const value = await redis.get("test-key");

        return NextResponse.json({
            message: "Redis is working!",
            data: value,
        });
    } catch (error) {
        if (error instanceof Error) {
            // Narrowed to Error type
            return NextResponse.json(
                { message: "Failed to connect to Redis", error: error.message },
                { status: 500 }
            );
        }

        // Fallback for non-Error types
        return NextResponse.json(
            { message: "An unknown error occurred", error: String(error) },
            { status: 500 }
        );
    } finally {
        await redis.quit(); // Ensure proper cleanup
    }
}
