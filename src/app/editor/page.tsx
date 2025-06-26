import { getServerSession } from "next-auth";
import authOptions from "../config/auth.config";
import connectMongo from "@/lib/mongoose";
import User from "../models/User";
import EditorClient from "./EditorClient";

interface UserProfile {
    name: string;
    email: string;
    profilePic?: string;
    niche?: string;
    bio?: string;
}

export default async function EditorPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return <div>Post Editor</div>;
    }

    await connectMongo();

    const user = await User.findOne({ email: session.user.email }).lean<UserProfile>();

    if (!user) {
        return <div>Home</div>;
    }

    const plainUser = JSON.parse(JSON.stringify(user));

    return <EditorClient user={plainUser} />;
}
