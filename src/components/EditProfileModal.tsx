"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, User, Tag, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type EditProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    currentNiche?: string;
    currentBio?: string;
    email: string;
    onUpdateSuccess?: (updatedData: {
        name: string;
        niche: string;
        bio: string;
    }) => void;
};

export default function EditProfileModal({
    isOpen,
    onClose,
    currentName,
    currentNiche = "",
    currentBio = "",
    email,
    onUpdateSuccess,
}: EditProfileModalProps) {
    const [updatedName, setUpdatedName] = useState(currentName);
    const [updatedNiche, setUpdatedNiche] = useState(currentNiche);
    const [updatedBio, setUpdatedBio] = useState(currentBio);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        const loadingToast = toast.loading("Saving...");
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    name: updatedName,
                    niche: updatedNiche,
                    bio: updatedBio,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                onUpdateSuccess?.({
                    name: updatedName,
                    niche: updatedNiche,
                    bio: updatedBio,
                });
                toast.success("Saved new user details", { id: loadingToast });
                onClose();
            } else {
                toast.error("Saving failed!", { id: loadingToast });
            }
        } catch (err) {
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setUpdatedName(currentName);
        setUpdatedNiche(currentNiche);
        setUpdatedBio(currentBio);
    }, [currentName, currentNiche, currentBio, isOpen])


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-gradient-to-br from-white to-gray-50 w-full max-w-lg mx-auto rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                            <p className="text-blue-100 text-sm mt-1">Update your profile information</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                            disabled={loading}
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                            <p className="text-blue-100 text-sm mt-1">Update your profile information</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                            disabled={loading}
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleUpdate} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-blue-600" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 hover:bg-white"
                                required
                            />
                        </div>

                        {/* Niche Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Tag size={16} className="text-purple-600" />
                                Writing Niche
                            </label>
                            <input
                                type="text"
                                value={updatedNiche}
                                onChange={(e) => setUpdatedNiche(e.target.value)}
                                placeholder="e.g., Fantasy, Romance, Sci-Fi"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 hover:bg-white"
                            />
                        </div>

                        {/* Bio Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FileText size={16} className="text-green-600" />
                                Bio
                            </label>
                            <textarea
                                value={updatedBio}
                                onChange={(e) => setUpdatedBio(e.target.value)}
                                placeholder="Tell us about yourself and your writing journey..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70 hover:bg-white resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {updatedBio.length}/500 characters
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>
            </motion.div>
        </div>
    );
}