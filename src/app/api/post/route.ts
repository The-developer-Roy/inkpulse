import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Post from "@/app/models/Post";
import mongoose from "mongoose";
import { postSchema, postUpdateSchema } from "@/app/schemas/post.schema";
import redis from "@/lib/redis";
import { RateLimiter } from "@/lib/rateLimiter";
import logger from "@/lib/logger";
import * as Sentry from "@sentry/react";
import sanitizeHtml from "sanitize-html";

const rateLimiter = new RateLimiter(5, 30); // Allow 5 requsts every 30 seconds

// GET request for fetching all posts or a single post based on the query parameter
export async function GET(req: NextRequest) {
  try {
    logger.info('Recieved a GET request from the endpoint: "api/post"');
    // Extracr the client IP address
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Apply rate limiting
    const rateLimitResult = await rateLimiter.applyLimit(ip);

    // If rate limit exceeded, return an error response
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { message: rateLimitResult.error },
        { status: 429 }
      );
    }

    const url = new URL(req.url);
    const postId = url.searchParams.get("id"); // Check if 'id' is provided

    // Check Redis first for cache
    if (postId) {
      // Try to get the cached post by ID
      const cachedPost = await redis.get(`post:${postId}`);
      if (cachedPost) {
        // Return cached post if available
        return NextResponse.json({
          message: "Post fetched from cache",
          data: JSON.parse(cachedPost),
        });
      }

      // If not found in cache, fetch from MongoDB
      await connectMongo();
      const post = await Post.findById(postId);

      logger.info("Post ID found in Database");

      if (!post) {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 }
        );
      }

      logger.info("Post ID not found in database");

      // Cache the fetched post in Redis for future requests
      await redis.set(`post:${postId}`, JSON.stringify(post), "EX", 3600); // Cache expires in 1 hour

      logger.info("Post ID stored in redis");

      return NextResponse.json({
        message: "Post fetched successfully",
        data: post,
      });
    } else {
      // For fetching all posts, check Redis cache first
      const cachedPosts = await redis.get("posts");
      if (cachedPosts) {
        // Return all posts from cache if available
        return NextResponse.json({
          message: "Posts fetched from cache",
          data: JSON.parse(cachedPosts),
        });
      }

      // If not found in cache, fetch all posts from MongoDB
      await connectMongo();
      const posts = await Post.find({});

      logger.info("Posts found in database");

      // Cache the fetched posts in Redis for future requests
      await redis.set("posts", JSON.stringify(posts), "EX", 3600); // Cache expires in 1 hour

      logger.info("Posts stored in redis");

      return NextResponse.json({
        message: "MongoDB connected successfully",
        data: posts,
      });
    }
  } catch (error) {
    Sentry.captureException(error); // Capture the error in Sentry
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "MongoDB connection failed", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred", error: String(error) },
      { status: 500 }
    );
  }
}

// POST request for creating a new post
export async function POST(req: NextRequest) {
  try {
    logger.info('Received a POST request from the endpoint: "api/post"');

    // Extracr the client IP address
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Apply rate limiting
    const rateLimitResult = await rateLimiter.applyLimit(ip);

    // If rate limit exceeded, return an error response
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { message: rateLimitResult.error },
        { status: 429 }
      );
    }

    await connectMongo(); // Ensure MongoDB connection

    // Parse the request body
    const { title, content, tags, author, status } = await req.json();

    // Validate using Zod
    const parsedBody = postSchema.safeParse({ title, content, tags, author });

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsedBody.error.errors },
        { status: 400 }
      );
    }

    // Check if the author is valid
    if (!author || !mongoose.Types.ObjectId.isValid(author)) {
      return NextResponse.json(
        { message: "Invalid or missing author ID" },
        { status: 400 }
      );
    }

    const cleanContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "h1",
        "h2",
        "h3",
        "u",
        "s",
      ]),
      allowedAttributes: {
        "*": ["href", "src", "alt", "title", "style"],
      },
      allowedSchemes: ["http", "https", "data"],
      allowedStyles: {
        "*": {
          "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
        },
      },
    });

    // Create a new post and cast author to ObjectId
    const post = new Post({
      title,
      content,
      tags,
      author: new mongoose.Types.ObjectId(author), // Use 'new' to instantiate ObjectId
      status: status === "published" ? "published" : "draft",
    });

    // Save the post
    const savedPost = await post.save();

    logger.info("Created a new post");

    // Invalidate the cache for all posts since a new one was added
    await redis.del("posts"); // This removes the cached list of posts

    // Optionally, you could also invalidate the cache for the individual post if you're caching it separately
    await redis.del(`post:${savedPost._id}`); // Invalidate the cache for the newly created post if cached

    // Return success response
    return NextResponse.json({
      message: "Post created successfully",
      data: savedPost,
    });
  } catch (error) {
    Sentry.captureException(error); // Capture the error in Sentry
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to create post", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred", error: String(error) },
      { status: 500 }
    );
  }
}

// PUT request to update a post by ID
export async function PUT(req: NextRequest) {
  try {
    logger.info('Received a PUT request from the endpoint: "api/post"');

    // Extracr the client IP address
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Apply rate limiting
    const rateLimitResult = await rateLimiter.applyLimit(ip);

    // If rate limit exceeded, return an error response
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { message: rateLimitResult.error },
        { status: 429 }
      );
    }

    await connectMongo(); // Reuse the connection logic

    // Extract post ID from the query parameters
    const url = new URL(req.url);
    const postId = url.searchParams.get("id");
    console.log("Extracted postID: ", postId);

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body for updated data
    const { title, content, tags } = await req.json();
    console.log("Recieved Request body: ", { title });

    // Validate using Zod schema
    const parsedBody = postUpdateSchema.safeParse({
      title,
      content,
      tags,
      author: postId,
    });

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsedBody.error.errors },
        { status: 400 }
      );
    }

    const cleanContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "h1",
        "h2",
        "h3",
        "u",
        "s",
      ]),
      allowedAttributes: {
        "*": ["href", "src", "alt", "title", "style"],
      },
      allowedSchemes: ["http", "https", "data"],
      allowedStyles: {
        "*": {
          "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
        },
      },
    });

    // Find the post by ID and update it
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, tags },
      { new: true } // Return the updated post
    );

    logger.info(`Post with ID: "${postId}" updated successfully`);

    if (!updatedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Invalidate the cache for the updated post
    await redis.del(`post:${postId}`); // Invalidate the cache for the specific post

    // Optionally, invalidate the list of all posts if needed
    await redis.del("posts"); // Invalidate the list of posts

    return NextResponse.json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error); // Capture the error in Sentry
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to update post", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred", error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE request to remove a post by ID

export async function DELETE(req: NextRequest) {
  try {
    logger.info('Received a DELETE request from the endpoint: "api/post"');

    // Extracr the client IP address
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Apply rate limiting
    const rateLimitResult = await rateLimiter.applyLimit(ip);

    // If rate limit exceeded, return an error response
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { message: rateLimitResult.error },
        { status: 429 }
      );
    }

    await connectMongo(); // Reuse the connection logic

    // Extract post ID from the query parameters
    const url = new URL(req.url);
    const postId = url.searchParams.get("id");
    console.log("Extracted postId in delete: ", postId);

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the post by ID
    const deletedPost = await Post.findByIdAndDelete(postId);
    console.log("Deleted post: ", deletedPost);

    logger.info(`Post with ID: "${postId}" deleted successfully`);

    if (!deletedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Invalidate the cache for the deleted post
    await redis.del(`post:${postId}`); // Invalidate the cache for the specific post

    // Optionally, invalidate the list of all posts if needed
    await redis.del("posts"); // Invalidate the list of posts

    return NextResponse.json({
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    Sentry.captureException(error); // Capture the error in Sentry
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to delete post", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred", error: String(error) },
      { status: 500 }
    );
  }
}
