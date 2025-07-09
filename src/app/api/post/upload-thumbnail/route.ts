import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectMongo from "@/lib/mongoose";
import Post from "@/app/models/Post";

export async function POST(req: NextRequest) {
  try {
    const { postId, image } = await req.json();

    if (!postId || !image) {
      return NextResponse.json(
        { error: "Missing postId or image" },
        { status: 400 }
      );
    }

    await connectMongo();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "post_thumbnails",
      transformation: [{ width: 600, height: 400, crop: "fill" }],
    });

    post.postPic = uploadResponse.secure_url;
    await post.save();

    return NextResponse.json({
      message: "Thumbnail uploaded successfully",
      imageUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
