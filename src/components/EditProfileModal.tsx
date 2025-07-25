"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
                onClose();
            } else {
                alert(data.message || "Update failed");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl"
            >
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleUpdate} className="space-y-3">
                    <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        placeholder="Name"
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        value={updatedNiche}
                        onChange={(e) => setUpdatedNiche(e.target.value)}
                        placeholder="Niche"
                        className="w-full px-3 py-2 border rounded"
                    />
                    <textarea
                        value={updatedBio}
                        onChange={(e) => setUpdatedBio(e.target.value)}
                        placeholder="Bio"
                        rows={4}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
