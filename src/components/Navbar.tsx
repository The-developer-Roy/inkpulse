"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
                            <button onClick={() => navigateWithSpinner("/")} className="hover:underline">Home</button>
                            <button onClick={() => navigateWithSpinner("/post")} className="hover:underline">Stories</button>
                            <button onClick={() => navigateWithSpinner("/categories")} className="hover:underline">Categories</button>
                            <button onClick={() => navigateWithSpinner("/about")} className="hover:underline">About Us</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigateWithSpinner("/about")} className="hover:underline">About Us</button>
                            <button onClick={() => navigateWithSpinner("/auth/signin")} className="hover:underline">Login</button>
                            <button onClick={() => navigateWithSpinner("/auth/register")} className="hover:underline">Signup</button>
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
                onMouseEnter={()=>setIsOpen(true)}
                onMouseLeave={()=>setIsOpen(false)}
            >
                <button className="outline-none bg-secondary p-2 rounded-xl w-full">
                    Your Profile
                </button>
                <button onClick={() => navigateWithSpinner("/drafts")} className="outline-none bg-secondary p-2 rounded-xl w-full">
                    My Drafts
                </button>
                <button className="outline-none bg-secondary p-2 rounded-xl w-full">
                    My Posts
                </button>
                <button className="text-red-800 outline-none bg-secondary p-2 rounded-xl w-full">
                    Logout
                </button>
            </motion.div>
        </>
    );
};

export default Navbar;
