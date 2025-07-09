import Image from "next/image";
import { getServerSession } from "next-auth";
import authOptions from "@/app/config/auth.config";
import connectMongo from "@/lib/mongoose";
import User from "@/app/models/User";
import UnauthenticatedHome from "@/components/UnauthenticatedHome";
import AuthenticatedHome from "@/components/AuthenticatedHome";

interface UserProfile {
    name: string;
    email: string;
    profilePic?: string;
    niche?: string;
    bio?: string;
}

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return <UnauthenticatedHome />;
    }

    await connectMongo();

    const user = await User.findOne({ email: session.user.email }).lean<UserProfile>();

    if (!user) {
        return <UnauthenticatedHome />;
    }

    return (
        <AuthenticatedHome name={user.name} email={user.email} profilePic={user.profilePic} niche={user.niche} bio={user.bio}/>
    );
}
