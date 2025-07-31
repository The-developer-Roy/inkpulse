import { getServerSession } from "next-auth";
import authOptions from "../config/auth.config";
import connectMongo from "@/lib/mongoose";
import User from "../models/User";
import EditorClient from "./EditorClient";
import Post from "../models/Post";
import { notFound } from "next/navigation";

interface UserProfile {
    name: string;
    email: string;
    profilePic?: string;
    niche?: string;
    bio?: string;
}

interface PageProps {
    searchParams: Promise<{ id?: string }>;
}

export default async function EditorPage({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return <div>Please Login to use the editor</div>;
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email }).lean<UserProfile>();
    if (!user) {
        return <div>Home</div>;
    }

    // Await searchParams since it's now a Promise
    const resolvedSearchParams = await searchParams;
    let postData = null;
    
    if (resolvedSearchParams?.id) {
        const post = await Post.findOne({ 
            _id: resolvedSearchParams.id, 
            author: session.user.id 
        }).lean();
        
        if (!post) return notFound(); // 404 if not found or unauthorized
        postData = JSON.parse(JSON.stringify(post)); // make serializable
    }

    return <EditorClient user={JSON.parse(JSON.stringify(user))} existingPost={postData}/>;
}