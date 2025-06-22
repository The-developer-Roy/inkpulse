import Image from "next/image";
import { getServerSession } from "next-auth";
import authOptions from "@/app/config/auth.config";
import connectMongo from "@/lib/mongoose";
import User from "@/app/models/User";

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
        return <div>Home</div>;
    }

    await connectMongo();

    const user = await User.findOne({ email: session.user.email }).lean<UserProfile>();

    if (!user) {
        return <div>Home</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
            {user.profilePic && (
                <Image
                    src={user.profilePic}
                    alt={`${user.name}'s Profile Picture`}
                    width={150}
                    height={150}
                    className="rounded-full"
                />
            )}
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-lg text-gray-700">{user.niche || "No Niche Provided"}</p>
            <p className="text-base text-gray-600 max-w-md text-center">{user.bio || "No Bio Provided"}</p>
        </div>
    );
}
