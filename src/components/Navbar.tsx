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

const Navbar: React.FC<NavbarProps> = ({ variant, profilePic, setLoading }) => {
    const isAuthenticated = variant === "authenticated";
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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
                        <Image src={profilePic} alt="User" width={40} height={40} className="rounded-full border" />
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
        </>
    );
};

export default Navbar;
