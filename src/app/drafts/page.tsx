'use client';

import React, { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import PostCard from '@/components/PostCard'; // Reuse existing component
import { useSession } from 'next-auth/react';

interface DraftPost {
    _id: string;
    title: string;
    content: string;
    postPic?: string;
    likes: string[];
    author: {
        name: string;
        profilePic?: string;
    };
}

const DraftsPage = () => {
    const [drafts, setDrafts] = useState<DraftPost[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== 'authenticated') return;

        const fetchDrafts = async () => {
            try {
                const res = await fetch('/api/post/drafts');
                if (res.ok) {
                    const data = await res.json();
                    setDrafts(data);
                }
            } catch (err) {
                console.error('Failed to fetch drafts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDrafts();
    }, [status]);

    if (loading) return <Spinner />;

    if (status !== 'authenticated') {
        return <p className="text-center mt-10">Please login to view your drafts.</p>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">📝 Your Drafts</h1>
            {drafts.length === 0 ? (
                <p className="text-gray-600">You don't have any drafts yet.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {drafts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DraftsPage;
