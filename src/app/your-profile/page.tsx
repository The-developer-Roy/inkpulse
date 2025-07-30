import { getServerSession } from "next-auth";
import authOptions from "../config/auth.config";
import connectMongo from "@/lib/mongoose";
import User from "../models/User";
import YourProfileClient from "./YourProfileClient";

interface UserProfile{
    name: string;
    email: string;
    profilePic?: string;
    niche?: string;
    bio?: string;
}

export default async function YourProfile() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return (<div>Please Login to view your Profile</div>);
    }

    await connectMongo();

    const user = await User.findOne({ email: session.user.email }).lean<UserProfile>();

    if (!user) {
        return (<div>Unable to find your profile</div>);
    }

    return (
        <YourProfileClient name={user.name} email={user.email} profilePic={user.profilePic} niche={user.niche} bio={user.bio}/>
    )
}