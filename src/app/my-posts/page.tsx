'use client';

import React, { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import DraftPostCard from '@/components/DraftsPostCard';

interface DraftPost {
    _id: string;
    title: string;
    content: string;
    postPic?: string;
    tags: string[];
    likes: string[];
    author: {
        name: string;
        profilePic?: string;
    };
}

const DraftsPage = () => {
    const [myPosts, setMyPosts] = useState<DraftPost[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    if(!session?.user.email) return;

    useEffect(() => {
        if (status !== 'authenticated') return;

        const fetchDrafts = async () => {
            try {
                const res = await fetch('/api/post/my-posts');
                if (res.ok) {
                    const data = await res.json();
                    setMyPosts(data);
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
            <h1 className="text-3xl font-bold mb-6">Your Posts</h1>
            {myPosts.length === 0 ? (
                <p className="text-gray-600">You don&apos;t have any posts yet.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {myPosts.map((post) => (
                        <DraftPostCard key={post._id} post={post} onDelete={(id)=>setMyPosts((prev)=>prev.filter((p)=>p._id!==id))} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DraftsPage;
