import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/config/auth.config";
import User from "@/app/models/User";
import connectMongo from "@/lib/mongoose";

export async function POST(req: Request) {
    try {
        await connectMongo(); // Ensure DB connection

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, profilePic, niche, bio } = await req.json();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { 
                name, 
                profilePic, 
                niche, 
                bio, 
                profileCompleted: true // ✅ Update profileCompleted
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
