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

export default async function EditorPage({ searchParams }: { searchParams: { id?: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return <div>Post Editor</div>;
    }

    await connectMongo();

    const user = await User.findOne({ email: session.user.email }).lean<UserProfile>();

    if (!user) {
        return <div>Home</div>;
    }

    let postData = null;

    if (searchParams?.id) {
        const post = await Post.findOne({ _id: searchParams?.id, author: session.user.id }).lean();
        if (!post) return notFound(); // 404 if not found or unauthorized
        postData = JSON.parse(JSON.stringify(post)); //make serializable
    }

    return <EditorClient user={JSON.parse(JSON.stringify(user))} existingPost={postData}/>;
}
