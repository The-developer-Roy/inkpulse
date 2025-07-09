"use client";

import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import Image from 'next/image';
import { Dancing_Script } from 'next/font/google';
import { Poppins } from 'next/font/google';
import Navbar from './Navbar';
import { useRouter } from 'next/navigation';
import PostCard from './PostCard'; // ⬅ Import PostCard

const dancingScript = Dancing_Script({
    weight: "400",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: "400",
    subsets: ["latin"],
});

interface Props {
    name: string;
    email: string;
    profilePic?: string;
    niche?: string;
    bio?: string;
}

interface TrendingPost {
    _id: string;
    title: string;
    content: string;
    postPic?: string;
    tags: string[];
    likes: string[];
    author: {
        name: string;
        profilePic?: string;
    };
}

const AuthenticatedHome: React.FC<Props> = ({ name, email, profilePic }) => {
    const [loading, setLoading] = useState(false);
    const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
    const router = useRouter();

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    };

    useEffect(() => {
        const fetchTrendingPosts = async () => {
            try {
                const res = await fetch("/api/post/trending");
                if (res.ok) {
                    const data = await res.json();
                    setTrendingPosts(data);
                }
            } catch (err) {
                console.error("Failed to fetch trending posts", err);
            }
        };
        fetchTrendingPosts();
    }, []);

    return (
        <main className={`custom-cursor min-h-screen w-full flex justify-center items-center flex-col overflow-x-hidden ${poppins.className}`}>
            {loading && <Spinner />}
            <Navbar variant="authenticated" setLoading={setLoading} profilePic={profilePic} />

            <button onClick={() => navigateWithSpinner("/editor")} className="bg-none outline-none hover:cursor-pointer fixed top-[90%] left-[95%] z-50 hover:scale-125 ease-in-out group">
                <div className='absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg hidden group-hover:block'>
                    Create a New Story
                </div>
                <Image src={"/pen-2.svg"} alt='pen' width={40} height={40} />
            </button>

            <section className="w-full max-w-5xl px-4 mt-32">
                <h2 className="text-3xl font-bold mb-6 text-center">🔥 Trending Stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingPosts.length > 0 ? (
                        trendingPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No trending stories yet.</p>
                    )}
                </div>
            </section>
        </main>
    );
};

export default AuthenticatedHome;
