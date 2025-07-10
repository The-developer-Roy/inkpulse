// src/app/api/post/drafts/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/config/auth.config";
import connectMongo from "@/lib/mongoose";
import Post from "@/app/models/Post";
import User from "@/app/models/User";

export const GET = async () => {
  await connectMongo();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the logged in user by email
    const user = await User.findOne({email: session.user.email});

    const drafts = await Post.find({
      status: "draft",
      author: user._id,
    }).sort({ createdAt: -1 }).populate("author", "name profilePic");

    return NextResponse.json(drafts);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
};
