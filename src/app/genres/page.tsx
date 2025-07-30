"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { Clapperboard, Heart, Sparkles, Swords, TestTubeDiagonal, VenetianMask } from 'lucide-react'


const Genres = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const categories = [
        { label: "Fantasy", icon: <Sparkles size={20} /> },
        { label: "Mystery", icon: <VenetianMask size={20} /> },
        { label: "Romance", icon: <Heart size={20} /> },
        { label: "Action", icon: <Swords size={20} /> },
        { label: "Sci-Fi", icon: <TestTubeDiagonal size={20} /> },
        { label: "Drama", icon: <Clapperboard size={20} /> },
    ];

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    };

    return (
        <main className="flex justify-center items-center h-screen w-screen">
            {loading && <Spinner />}
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
        </main>
    )
}

export default Genres;