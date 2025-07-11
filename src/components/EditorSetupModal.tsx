// components/EditorSetupModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Props {
    onSubmit: (data: { title: string; tags: string[] }) => void;
}

const EditorSetupModal: React.FC<Props> = ({ onSubmit }) => {
    const [open, setOpen] = useState(true);
    const [title, setTitle] = useState('Untitled Post');
    const [tags, setTags] = useState('');

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

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-[90vw] max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Start a New Post</h2>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Post Title"
                    className="w-full mb-4 px-4 py-2 border rounded-md dark:bg-zinc-800"
                />
                <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="Enter tags separated by commas"
                    className="w-full mb-4 px-4 py-2 border rounded-md dark:bg-zinc-800"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Continue to Editor
                </button>
            </div>
        </div>
    );
};

export default EditorSetupModal;
