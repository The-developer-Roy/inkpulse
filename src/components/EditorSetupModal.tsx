'use client';

import React, { useState, useEffect } from 'react';
import { Edit3, Tag, Sparkles } from 'lucide-react';

// Mock toast for demonstration
const toast = {
    loading: (message: string) => {
        console.log('Loading:', message);
        return 'loading-id';
    },
    success: (message: string, options?: any) => {
        console.log('Success:', message);
    }
};

interface Props {
    onSubmit: (data: { title: string; tags: string[] }) => void;
}

const EditorSetupModal: React.FC<Props> = ({ onSubmit = () => { } }) => {
    const [open, setOpen] = useState(true);
    const [title, setTitle] = useState('Untitled Post');
    const [tags, setTags] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (open) {
            setIsAnimating(true);
        }
    }, [open]);

    const handleSubmit = () => {
        const loadingToast = toast.loading("Creating...");
        const tagsArray = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');
        localStorage.setItem("post_title", title);
        localStorage.setItem("post_tags", JSON.stringify(tagsArray));

        onSubmit({ title, tags: tagsArray });
        setOpen(false);

        toast.success("Editor Ready.", { id: loadingToast });
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => setOpen(false), 200);
    };

    if (!open) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
                }`}
        >
            <div
                className={`relative bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 
                    rounded-3xl w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-zinc-700/50
                    transform transition-all duration-500 ease-out ${isAnimating
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-95 opacity-0 translate-y-4'
                    }`}
            >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />

                {/* Header with icon */}
                <div className="relative p-8 pb-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Craft Something New
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                        Name your story, let others find it through the tags and begin writing
                    </p>
                </div>

                {/* Form */}
                <div className="relative px-8 pb-8 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Edit3 className="w-4 h-4 mr-2 text-blue-500" />
                            Post Title
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Enter your post title"
                                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 
                                    rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200
                                    hover:border-gray-300 dark:hover:border-zinc-500"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200" />
                        </div>
                    </div>

                    {/* Tags Input */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Tag className="w-4 h-4 mr-2 text-purple-500" />
                            Tags
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                                placeholder="e.g: You can enter your story's genre"
                                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 
                                    rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200
                                    hover:border-gray-300 dark:hover:border-zinc-500"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Separate tags with commas
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 
                            text-white font-semibold py-3.5 rounded-xl shadow-lg
                            hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                            transition-all duration-200 group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <div className="relative flex items-center justify-center">
                            <span>Continue to Editor</span>
                            <div className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
                                →
                            </div>
                        </div>
                    </button>
                </div>

                {/* Floating particles effect */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse" />
                <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
        </div>
    );
};

export default EditorSetupModal;