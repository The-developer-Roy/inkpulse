import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Comment from '@/app/models/Comment';
import { RateLimiter } from '@/lib/rateLimiter';
import logger from '@/lib/logger';
import * as Sentry from '@sentry/react'

const rateLimiter = new RateLimiter(5, 30); // Allow 5 requsts every 30 seconds

// POST request for adding a new comment
export async function POST(req: NextRequest) {
    try {
        logger.info('Received a POST request from the endpoint: "api/comment"');

        // Extracr the client IP address
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

        // Apply rate limiting
        const rateLimitResult = await rateLimiter.applyLimit(ip);

        // If rate limit exceeded, return an error response
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { message: rateLimitResult.error },
                { status: 429 }
            );
        }

        await connectMongo();

        const body = await req.json();
        const { postId, userId, content } = body;

        if (!postId || !userId || !content) {
            return NextResponse.json(
                { message: 'Missing required fields: postId, userId, or content' },
                { status: 400 }
            );
        }

        const newComment = await Comment.create({ postId, userId, content });

        logger.info("successfully created a comment");

        return NextResponse.json({
            message: 'Comment created successfully',
            data: newComment,
        });
    } catch (error) {
        Sentry.captureException(error); // Capture the error in Sentry
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to create comment', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}

// GET request for fetching all comments for a post.
export async function GET(req: NextRequest) {
    try {
        logger.info('Received a GET request from the endpoint: "api/comment"');

        // Extracr the client IP address
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

        // Apply rate limiting
        const rateLimitResult = await rateLimiter.applyLimit(ip);

        // If rate limit exceeded, return an error response
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { message: rateLimitResult.error },
                { status: 429 }
            );
        }

        await connectMongo();

        // Extract postId from query params
        const postId = req.nextUrl.searchParams.get('postId');

        if (!postId) {
            return NextResponse.json(
                { message: 'postId is required in the query parameters' },
                { status: 400 }
            );
        }

        // Find comments associated with the specific postId
        const comments = await Comment.find({ postId }).populate('userId', 'name email');

        if (comments.length === 0) {
            return NextResponse.json(
                { message: 'No comments found for this post' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Comments fetched successfully',
            data: comments,
        });
    } catch (error) {
        Sentry.captureException(error); // Capture the error in Sentry
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to fetch comments', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}

// DELETE request for deleting a comment
export async function DELETE(req: NextRequest) {
    try {
        logger.info('Received a POST request from the endpoint: "api/comment"');

        // Extracr the client IP address
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

        // Apply rate limiting
        const rateLimitResult = await rateLimiter.applyLimit(ip);

        // If rate limit exceeded, return an error response
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { message: rateLimitResult.error },
                { status: 429 }
            );
        }
        
        await connectMongo();

        // Extract commentId from the query parameters
        const commentId = req.nextUrl.searchParams.get('commentId');

        if (!commentId) {
            return NextResponse.json(
                { message: 'commentId is required in the query parameters' },
                { status: 400 }
            );
        }

        // Find and delete the comment by its commentId
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        logger.info(`A comment with ID: ${commentId} deleted successfully`);

        if (!deletedComment) {
            return NextResponse.json(
                { message: 'Comment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Comment deleted successfully',
            data: deletedComment,
        });
    } catch (error) {
        Sentry.captureException(error); // Capture the error in Sentry
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to delete comment', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}