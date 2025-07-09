"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";
import { useRouter } from "next/navigation";

const dancingScript = Dancing_Script({
    weight: "400",
    subsets: ["latin"],
});

type NavbarProps = {
    variant: "authenticated" | "unauthenticated";
    profilePic?: string; // Only needed when authenticated
    setLoading: (value: boolean) => void;
};

const Navbar: React.FC<NavbarProps> = ({ variant, profilePic, setLoading }) => {
    const isAuthenticated = variant === "authenticated";

    const router = useRouter();

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    }

    return (
        <nav className={`w-[90%] flex items-center justify-between px-6 py-4 bg-secondary shadow-md fixed top-5 rounded-xl z-50 ${dancingScript.className}`}>
            {/* Logo */}
            <Link href="/" className="flex justify-center items-center text-3xl gap-4">
                <Image src={"/logo.png"} alt="logo" width={32} height={32} />
                <span className={`${dancingScript.className}`}>Inkpulse</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex gap-20 items-center justify-center text-2xl">
                {isAuthenticated ? (
                    <>
                        <button onClick={() => { navigateWithSpinner("/") }} className="hover:underline bg-none outline-none">Home</button>
                        <button onClick={() => { navigateWithSpinner("/post") }} className="hover:underline bg-none outline-none">Stories</button>
                        <button onClick={() => { navigateWithSpinner("/categories") }} className="hover:underline bg-none outline-none">Categories</button>
                        <button onClick={() => { navigateWithSpinner("/about") }} className="hover:underline bg-none outline-none">About Us</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => { navigateWithSpinner("/about") }} className="hover:underline">About Us</button>
                        <button onClick={() => { navigateWithSpinner("/auth/signin") }} className="hover:underline">Login</button>
                        <button onClick={() => { navigateWithSpinner("/auth/register") }} className="hover:underline">Signup</button>
                    </>
                )}
            </div>

            {/* Profile Picture (only if authenticated) */}
            {isAuthenticated && profilePic && (
                <Image
                    src={profilePic}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-300"
                />
            )}
        </nav>
    );
};

export default Navbar;
