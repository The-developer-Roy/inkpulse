import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Post from "@/app/models/Post";
import { Types } from "mongoose";

export async function GET() {
  try {
    await connectMongo();

    const trendingPosts = await Post.find()
      .sort({ likes: -1 })
      .limit(5)
      .populate('author', 'name profilePic')
      .lean();

    if (!trendingPosts) {
      return NextResponse.json({ message: "No trending post found." }, { status: 404 });
    }

    return NextResponse.json(trendingPosts);
  } catch (error) {
    console.error("Error fetching trending post:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
