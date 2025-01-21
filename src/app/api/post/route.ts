import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Post from '@/app/models/Post';
import mongoose from 'mongoose';
import { postSchema } from '@/app/schemas/post.schema';

// GET request for fetching all posts or a single post based on the query parameter
export async function GET(req: NextRequest) {
    try {
        await connectMongo(); // Reuse the connection logic

        const url = new URL(req.url);
        const postId = url.searchParams.get('id'); // Check if 'id' is provided

        if (postId) {
            // If 'id' is provided, fetch a single post by ID
            const post = await Post.findById(postId);

            if (!post) {
                return NextResponse.json(
                    { message: 'Post not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                message: 'Post fetched successfully',
                data: post,
            });
        } else {
            // If no 'id' is provided, fetch all posts
            const posts = await Post.find({});
            return NextResponse.json({
                message: 'MongoDB connected successfully',
                data: posts,
            });
        }

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'MongoDB connection failed', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}

// POST request for creating a new post
export async function POST(req: NextRequest) {
    try {
        await connectMongo(); // Ensure MongoDB connection

        // Parse the request body
        const { title, content, tags, author } = await req.json();

        // Validate using Zod
        const parsedBody = postSchema.safeParse({ title, content, tags, author });

        if (!parsedBody.success) {
            return NextResponse.json(
                { message: 'Validation failed', errors: parsedBody.error.errors },
                { status: 400 }
            );
        }

        // Check if the author is valid
        if (!author || !mongoose.Types.ObjectId.isValid(author)) {
            return NextResponse.json(
                { message: 'Invalid or missing author ID' },
                { status: 400 }
            );
        }

        // Create a new post and cast author to ObjectId
        const post = new Post({
            title,
            content,
            tags,
            author: new mongoose.Types.ObjectId(author), // Use 'new' to instantiate ObjectId
        });

        // Save the post
        const savedPost = await post.save();

        // Return success response
        return NextResponse.json({
            message: 'Post created successfully',
            data: savedPost,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to create post', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}

// PUT request to update a post by ID
export async function PUT(req: NextRequest) {
    try {
        await connectMongo(); // Reuse the connection logic

        // Extract post ID from the query parameters
        const url = new URL(req.url);
        const postId = url.searchParams.get('id');

        if (!postId) {
            return NextResponse.json(
                { message: 'Post ID is required' },
                { status: 400 }
            );
        }

        // Parse the request body for updated data
        const { title, content, tags } = await req.json();

        // Validate using Zod schema
        const parsedBody = postSchema.safeParse({ title, content, tags, author: postId });

        if (!parsedBody.success) {
            return NextResponse.json(
                { message: 'Validation failed', errors: parsedBody.error.errors },
                { status: 400 }
            );
        }

        // Find the post by ID and update it
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, tags },
            { new: true } // Return the updated post
        );

        if (!updatedPost) {
            return NextResponse.json(
                { message: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Post updated successfully',
            data: updatedPost,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to update post', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}

// DELETE request to remove a post by ID

export async function DELETE(req: NextRequest) {
    try {
        await connectMongo(); // Reuse the connection logic

        // Extract post ID from the query parameters
        const url = new URL(req.url);
        const postId = url.searchParams.get('id');

        if (!postId) {
            return NextResponse.json(
                { message: 'Post ID is required' },
                { status: 400 }
            );
        }

        // Find and delete the post by ID
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return NextResponse.json(
                { message: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Post deleted successfully',
            data: deletedPost,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to delete post', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}