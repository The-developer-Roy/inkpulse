"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import EditProfileModal from "@/components/EditProfileModal";

const poppins = Poppins({
    weight: ["400", "600", "700"],
    subsets: ["latin"]
});

interface Props {
    name: string;
    email: string;
    profilePic?: string;
    niche?: string;
    bio?: string;
}

const YourProfileClient: React.FC<Props> = ({ name, email, profilePic, niche, bio }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedName, setUpdatedName] = useState(name);
    const [updatedNiche, setUpdatedNiche] = useState(niche);
    const [updatedBio, setUpdatedBio] = useState(bio);

    const handleUpdateSuccess = (updatedData: {
        name: string;
        niche: string;
        bio: string;
    }) => {
        setUpdatedName(updatedData.name);
        setUpdatedNiche(updatedData.niche);
        setUpdatedBio(updatedData.bio);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const profilePicVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "backOut"
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className={`custom-cursor min-h-screen w-full relative overflow-x-hidden ${poppins.className}`}
             style={{ backgroundColor: 'var(--background, #80cbc4)' }}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-20"
                    style={{ backgroundColor: 'var(--secondary, #ffb433)' }}
                    variants={{floatingVariants}}
                    animate="animate"
                />
                <motion.div
                    className="absolute top-60 right-20 w-24 h-24 rounded-full opacity-15"
                    style={{ backgroundColor: 'var(--primary, #fbf8ef)' }}
                    variants={{floatingVariants}}
                    animate="animate"
                    transition={{ delay: 2 }}
                />
                <motion.div
                    className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full opacity-25"
                    style={{ backgroundColor: 'var(--dominant, #b4ebe6)' }}
                    variants={{floatingVariants}}
                    animate="animate"
                    transition={{ delay: 1 }}
                />
            </div>

            <motion.main 
                className="relative z-10 flex justify-start items-start flex-col gap-16 p-8 md:p-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.section 
                    className="flex flex-col lg:flex-row justify-start items-center gap-10 lg:gap-16 w-full"
                    variants={{itemVariants}}
                >
                    {profilePic && (
                        <motion.div 
                            className="relative"
                            variants={{profilePicVariants}}
                        >
                            {/* Decorative ring */}
                            <motion.div
                                className="absolute -inset-4 rounded-full border-4 border-opacity-30"
                                style={{ borderColor: 'var(--secondary, #ffb433)' }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Profile picture */}
                            <motion.div
                                className="relative overflow-hidden rounded-full border-4 shadow-2xl"
                                style={{ borderColor: 'var(--primary, #fbf8ef)' }}
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image 
                                    src={profilePic} 
                                    alt="Profile picture" 
                                    width={250} 
                                    height={250} 
                                    className="object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    )}

                    <motion.div 
                        className="flex flex-col justify-center items-center lg:items-start gap-6 text-center lg:text-left"
                        variants={{itemVariants}}
                    >
                        {/* Name with gradient effect */}
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            {updatedName}
                        </motion.h1>
                        
                        {/* Niche with animated underline */}
                        {updatedNiche && (
                            <motion.div className="relative">
                                <motion.span 
                                    className="text-2xl md:text-3xl font-semibold"
                                    style={{ color: 'var(--primary, #fbf8ef)' }}
                                >
                                    {updatedNiche}
                                </motion.span>
                                <motion.div
                                    className="absolute -bottom-2 left-0 h-1 rounded-full"
                                    style={{ backgroundColor: 'var(--secondary, #ffb433)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </motion.div>
                        )}

                        {/* Email with hover effect */} 
                        <motion.a
                            href={`mailto:${email}`}
                            className="text-lg opacity-80 hover:opacity-100 transition-all duration-300 px-4 py-2 rounded-full"
                            style={{ 
                                color: 'black',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {email}
                        </motion.a>

                        <motion.button
                            
                            className="text-lg opacity-80 hover:opacity-100 transition-all duration-300 px-4 py-2 rounded-full"
                            style={{ 
                                color: 'black',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={()=>setIsModalOpen(true)}
                        >
                            Edit Profile
                        </motion.button>
                    </motion.div>
                </motion.section>

                {/* About Section */}
                {updatedBio && (
                    <motion.section 
                        className="w-full"
                        variants={{itemVariants}}
                    >
                        <motion.div
                            className="rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm border border-opacity-20"
                            style={{ 
                                backgroundColor: 'var(--dominant, #b4ebe6)',
                                borderColor: 'var(--primary, #fbf8ef)'
                            }}
                            whileHover={{ 
                                scale: 1.02,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Section title */}
                            <motion.h2 
                                className="text-4xl md:text-5xl font-bold mb-8 text-center text-black"
                                style={{ color: 'black' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                About Me
                            </motion.h2>

                            {/* Bio text with staggered animation */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <p 
                                    className="text-xl md:text-2xl leading-relaxed text-center md:text-left"
                                    style={{ color: 'black' }}
                                >
                                    {updatedBio}
                                </p>
                            </motion.div>

                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full opacity-30"
                                 style={{ backgroundColor: 'var(--secondary, #ffb433)' }}>
                            </div>
                            <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full opacity-20"
                                 style={{ backgroundColor: 'var(--secondary, #ffb433)' }}>
                            </div>
                        </motion.div>
                    </motion.section>
                )}
            </motion.main>

            <EditProfileModal
                isOpen={isModalOpen}
                onClose={()=>setIsModalOpen(false)}
                currentName={updatedName}
                currentNiche={updatedNiche}
                currentBio={updatedBio}
                email={email}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </div>
    );
};

export default YourProfileClient;