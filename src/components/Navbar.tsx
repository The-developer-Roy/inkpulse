"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";
import { useRouter } from "next/navigation";
import { Search, X, Menu } from "lucide-react";
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

const mobileMenuVariants = {
    open: {
        opacity: 1,
        x: 0,
        display: "flex",
        transition: { duration: 0.3 },
    },
    closed: {
        opacity: 0,
        x: "100%",
        transitionEnd: { display: "none" },
        transition: { duration: 0.3 },
    },
};

const Navbar: React.FC<NavbarProps> = ({ variant, profilePic, setLoading }) => {
    const isAuthenticated = variant === "authenticated";
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [genreIsOpen, setGenreIsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const categories = [
        { label: "Fantasy", icon: <Sparkles size={20} /> },
        { label: "Mystery", icon: <VenetianMask size={20} /> },
        { label: "Romance", icon: <Heart size={20} /> },
        { label: "Action", icon: <Swords size={20} /> },
        { label: "Sci-Fi", icon: <TestTubeDiagonal size={20} /> },
        { label: "Drama", icon: <Clapperboard size={20} /> },
        { label: "genres", icon: <Ellipsis size={20} /> },
    ];

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        setMobileMenuOpen(false);
        router.push(path);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setLoading(true);
        router.push(`/post?query=${encodeURIComponent(searchTerm.trim())}`);
        setShowSearch(false);
        setSearchTerm("");
        setMobileMenuOpen(false);
    };

    const logout = async () => {
        setLoading(true);
        setMobileMenuOpen(false);
        await fetch("/api/auth/logout", { method: "POST" });
        router.refresh(); // Refresh the server components
        router.push("/");
    }

    return (
        <>
            <nav className={`w-[90%] flex items-center justify-between px-3 sm:px-6 py-4 bg-secondary shadow-md fixed top-5 rounded-3xl z-50 ${dancingScript.className}`}>
                <Link href="/" className="flex items-center text-2xl sm:text-3xl gap-2 sm:gap-4">
                    <Image src={"/logo.png"} alt="logo" width={32} height={32} />
                    <span className="hidden xs:block">Inkpulse</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-20 items-center text-2xl">
                    {isAuthenticated ? (
                        <>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/")}>Home</button>
                            </UnderlineAnimation>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/post")}>Stories</button>
                            </UnderlineAnimation>
                            <UnderlineAnimation animationDuration={0.1}>
                                <button onClick={() => navigateWithSpinner("/genres")} onMouseEnter={() => setGenreIsOpen(true)} onMouseLeave={() => setGenreIsOpen(false)}>Genres</button>
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

                {/* Right side icons */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {isAuthenticated && (
                        <button onClick={() => setShowSearch(prev => !prev)} className="hidden lg:block">
                            {showSearch ? <X size={24} /> : <Search size={24} />}
                        </button>
                    )}

                    {isAuthenticated && profilePic && (
                        <Image
                            src={profilePic}
                            alt="User"
                            width={40}
                            height={40}
                            className="hidden lg:block rounded-full border hover:cursor-pointer"
                            onMouseEnter={() => setIsOpen(true)}
                            onMouseLeave={() => setIsOpen(false)}
                        />
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="lg:hidden"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        className={`lg:hidden fixed top-[100px] right-[5%] w-[90%] max-w-sm bg-secondary shadow-lg rounded-2xl z-40 flex-col p-6 max-h-[calc(100vh-120px)] overflow-y-auto ${dancingScript.className}`}
                    >
                        {/* Mobile Search */}
                        {isAuthenticated && (
                            <form onSubmit={handleSearchSubmit} className="mb-6">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search posts..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring focus:border-blue-500"
                                />
                            </form>
                        )}

                        {/* Mobile Navigation Links */}
                        <div className="flex flex-col gap-4 text-xl">
                            {isAuthenticated ? (
                                <>
                                    <button onClick={() => navigateWithSpinner("/")} className="text-left py-2 border-b border-gray-200">Home</button>
                                    <button onClick={() => navigateWithSpinner("/post")} className="text-left py-2 border-b border-gray-200">Stories</button>
                                    <button onClick={() => navigateWithSpinner("/genres")} className="text-left py-2 border-b border-gray-200">Genres</button>
                                    <button onClick={() => navigateWithSpinner("/About")} className="text-left py-2 border-b border-gray-200">About Us</button>

                                    {/* Mobile Profile Menu */}
                                    {profilePic && (
                                        <>
                                            <div className="flex items-center gap-3 py-2 border-b border-gray-200">
                                                <Image src={profilePic} alt="User" width={32} height={32} className="rounded-full border" />
                                                <span>Profile Menu</span>
                                            </div>
                                            <button onClick={() => navigateWithSpinner("/your-profile")} className="text-left py-2 pl-4 text-lg">Your Profile</button>
                                            <button onClick={() => navigateWithSpinner("/drafts")} className="text-left py-2 pl-4 text-lg">My Drafts</button>
                                            <button onClick={() => navigateWithSpinner("/my-posts")} className="text-left py-2 pl-4 text-lg">My Posts</button>
                                            <button onClick={logout} className="text-left py-2 pl-4 text-lg text-red-800">Logout</button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button onClick={() => navigateWithSpinner("/About")} className="text-left py-2 border-b border-gray-200">About Us</button>
                                    <button onClick={() => navigateWithSpinner("/auth/signin")} className="text-left py-2 border-b border-gray-200">Login</button>
                                    <button onClick={() => navigateWithSpinner("/auth/register")} className="text-left py-2">Signup</button>
                                </>
                            )}
                        </div>


                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Search Bar */}
            <AnimatePresence>
                {isAuthenticated && showSearch && !mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="hidden lg:block fixed top-[100px] w-[90%] z-40"
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

            {/* Desktop Profile Dropdown */}
            <motion.div
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={dropdownVariants}
                className="hidden lg:flex justify-center items-center flex-col gap-5 fixed top-[15%] left-[80%] -translate-x-1/2 -translate-y-10 bg-white p-5 rounded-xl hover:cursor-pointer w-[15%]"
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

            {/* Desktop Genre Dropdown */}
            <motion.div
                initial="closed"
                animate={genreIsOpen ? "open" : "closed"}
                variants={dropdownVariants}
                className="hidden lg:flex justify-center items-center gap-5 fixed top-[15%] left-[30%] -translate-x-1/2 -translate-y-10 bg-dominant p-5 rounded-xl hover:cursor-pointer w-[50%]"
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