"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UnderlineAnimation from "./UnderlineAnimation";
import { Clapperboard, Ellipsis, Heart, Sparkles, Swords, TestTubeDiagonal, VenetianMask } from 'lucide-react'

const dancingScript = Dancing_Script({
    weight: "400",
    subsets: ["latin"],
});

type NavbarProps = {
    variant: "authenticated" | "unauthenticated";
    profilePic?: string;
    setLoading: (value: boolean) => void;
};

const dropdownVariants = {
    open: {
        opacity: 1,
        y: 0,
        display: "flex",
        transition: { duration: 0.2 },
    },
    closed: {
        opacity: 0,
        y: -10,
        transitionEnd: { display: "none" },
        transition: { duration: 0.2 },
    },
};

const Navbar: React.FC<NavbarProps> = ({ variant, profilePic, setLoading }) => {
    const isAuthenticated = variant === "authenticated";
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [genreIsOpen, setGenreIsOpen] = useState(false);

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setLoading(true);
        router.push(`/post?query=${encodeURIComponent(searchTerm.trim())}`);
        setShowSearch(false);
        setSearchTerm("");
    };

    const logout = async ()=>{
        setLoading(true);
        await fetch("/api/auth/logout", { method: "POST" });
        router.refresh(); // Refresh the server components
        router.push("/");
    }

    return (
        <>
            <nav className={`w-[90%] flex items-center justify-between px-6 py-4 bg-secondary shadow-md fixed top-5 rounded-xl z-50 ${dancingScript.className}`}>
                <Link href="/" className="flex items-center text-3xl gap-4">
                    <Image src={"/logo.png"} alt="logo" width={32} height={32} />
                    <span>Inkpulse</span>
                </Link>

                <div className="flex gap-20 items-center text-2xl">
                    {isAuthenticated ? (
                        <>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/")}>Home</button>
                            </UnderlineAnimation>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/post")}>Stories</button>
                            </UnderlineAnimation>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/categories")} onMouseEnter={() => setGenreIsOpen(true)} onMouseLeave={() => setGenreIsOpen(false)}>Genres</button>
                            </UnderlineAnimation>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/About")}>About Us</button>
                            </UnderlineAnimation>
                        </>
                    ) : (
                        <>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/About")}>About Us</button>
                            </UnderlineAnimation>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/auth/signin")}>Login</button>
                            </UnderlineAnimation>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/auth/register")}>Signup</button>
                            </UnderlineAnimation>
                        </>
                    )}
                </div>

                {isAuthenticated && profilePic && (
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowSearch(prev => !prev)}>
                            {showSearch ? <X size={24} /> : <Search size={24} />}
                        </button>
                        <Image src={profilePic} alt="User" width={40} height={40} className="rounded-full border hover:cursor-pointer" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} />
                    </div>
                )}
            </nav>

            {/* Search Bar */}
            <AnimatePresence>
                {isAuthenticated && showSearch && (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed top-[100px] w-[90%] z-40"
                    >
                        <form onSubmit={handleSearchSubmit} className="mx-auto px-6">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search posts..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={dropdownVariants}
                className="flex justify-center items-center flex-col gap-5 fixed top-[15%] left-[80%] -translate-x-1/2 -translate-y-10 bg-white p-5 rounded-xl hover:cursor-pointer w-[15%]"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <button onClick={() => navigateWithSpinner("/your-profile")} className="outline-none bg-secondary p-2 rounded-xl w-full">
                    Your Profile
                </button>
                <button onClick={() => navigateWithSpinner("/drafts")} className="outline-none bg-secondary p-2 rounded-xl w-full">
                    My Drafts
                </button>
                <button onClick={() => navigateWithSpinner("/my-posts")} className="outline-none bg-secondary p-2 rounded-xl w-full">
                    My Posts
                </button>
                <button onClick={logout} className="text-red-800 outline-none bg-secondary p-2 rounded-xl w-full">
                    Logout
                </button>
            </motion.div>

            <motion.div
                initial="closed"
                animate={genreIsOpen ? "open" : "closed"}
                variants={dropdownVariants}
                className="flex justify-center items-center gap-5 fixed top-[15%] left-[30%] -translate-x-1/2 -translate-y-10 bg-dominant p-5 rounded-xl hover:cursor-pointer w-[50%]"
                onMouseEnter={() => setGenreIsOpen(true)}
                onMouseLeave={() => setGenreIsOpen(false)}
            >
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
            </motion.div>
        </>
    );
};

export default Navbar;
