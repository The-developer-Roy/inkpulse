import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Post from "@/app/models/Post";
import { getServerSession } from "next-auth";
import authOptions from "@/app/config/auth.config";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await req.json();

    await connectMongo();

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const alreadyLiked = post.likes.includes(session.user.id);

    if (alreadyLiked) {
        post.likes.pull(session.user.id);
    } else {
        post.likes.push(session.user.id);
    }

    await post.save();

    return NextResponse.json({ message: alreadyLiked ? "Unliked" : "Liked", likesCount: post.likes.length });
}
