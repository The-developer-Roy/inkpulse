"use client";

import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import Image from 'next/image';
import { Dancing_Script } from 'next/font/google';
import { Poppins } from 'next/font/google';
import Navbar from './Navbar';
import { useRouter } from 'next/navigation';
import PostCard from './PostCard'; // ⬅ Import PostCard
import { motion } from 'framer-motion';
import { Clapperboard, Ellipsis, Heart, Sparkles, Swords, TestTubeDiagonal, VenetianMask } from 'lucide-react'
import Footer from './Footer';

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

// Skeleton Component for Loading
const TrendingPostSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="bg-gray-200 rounded-lg shadow-md overflow-hidden animate-pulse"
        >
            <div className="w-full h-40 bg-gray-300"></div>
            <div className="p-4">
                <div className="h-5 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
        </motion.div>
    );
};

const AuthenticatedHome: React.FC<Props> = ({ name, email, profilePic }) => {
    const [loading, setLoading] = useState(false);
    const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
    const [loadingTrending, setLoadingTrending] = useState(false);
    const router = useRouter();

    const categories = [
        { label: "Fantasy", icon: <Sparkles size={20} /> },
        { label: "Mystery", icon: <VenetianMask size={20} /> },
        { label: "Romance", icon: <Heart size={20} /> },
        { label: "Action", icon: <Swords size={20} /> },
        { label: "Sci-Fi", icon: <TestTubeDiagonal size={20} /> },
        { label: "Drama", icon: <Clapperboard size={20} /> },
        { label: "And More", icon: <Ellipsis size={20} /> },
    ];

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    };

    useEffect(() => {
        const fetchTrendingPosts = async () => {
            try {
                setLoadingTrending(true);
                const res = await fetch("/api/post/trending");
                if (res.ok) {
                    const data = await res.json();
                    setTrendingPosts(data);
                }
            } catch (err) {
                console.error("Failed to fetch trending posts", err);
            }
            finally {
                setLoadingTrending(false);
            }
        };
        fetchTrendingPosts();
    }, []);

    return (
        <main className={`custom-cursor min-h-screen w-full flex justify-center items-center flex-col overflow-x-hidden ${poppins.className} gap-5`}>
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
                    {loadingTrending ? (
                        // Render 3 skeleton placeholders
                        Array.from({ length: 3 }).map((_, idx) => (
                            <TrendingPostSkeleton key={idx} />
                        ))
                    ) : trendingPosts.length > 0 ? (
                        trendingPosts.map((post) => (
                            <PostCard key={post._id} post={post} setLoading={setLoading} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No trending stories yet.</p>
                    )}
                </div>
            </section>
            <section className='w-full flex justify-center items-center bg-dominant py-20 px-6 md:px-16 flex-col gap-5'>
                <h1 className='text-5xl'>Explore Genres</h1>
                <p className='text-gray-700'>Find stories that match your inerests from our diverse collection of genres.</p>
                <div className='flex justify-center items-center gap-10 w-full flex-wrap'>
                    {categories.map((category) => (
                        <button
                            key={category.label}
                            onClick={() => navigateWithSpinner(`/post?query=${encodeURIComponent(category.label)}`)}
                            className='bg-primary flex flex-col justify-center items-center gap-3 rounded-xl p-4 w-[120px] hover:scale-105 transition duration-200'
                        >
                            <div className='rounded-full bg-background p-2'>
                                {category.icon}
                            </div>
                            <span className='text-secondary'>{category.label}</span>
                        </button>
                    ))}
                </div>
            </section>
            <Footer/>
        </main>
    );
};

export default AuthenticatedHome;
