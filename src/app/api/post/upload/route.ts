import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import authOptions from "@/app/config/auth.config";
import connectMongo from "@/lib/mongoose";
import Post from "@/app/models/Post";

export async function POST(req: NextRequest) {
    try {
        // Ensure the user is authenticated
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { image } = await req.json(); // Expecting base64 image data

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        await connectMongo(); // Connect to MongoDB

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "blog_uploads", // Optional: Store images in a specific folder
            transformation: [{ width: 300, height: 300, crop: "fill" }], // Resize
        });

        const imageUrl = uploadResponse.secure_url; // Get Cloudinary URL

        // Update user's profilePic field
        await Post.findOneAndUpdate(
            { email: session.user.email },
            { postPic: imageUrl },
            { new: true }
        );

        return NextResponse.json({ message: "Post picture updated", imageUrl });
    } catch (error) {
        console.error("Error uploading post picture:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
