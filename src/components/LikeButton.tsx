"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface LikeButtonProps {
    postId: string;
    initialLiked: boolean;
    initialLikesCount: number;
}

export default function LikeButton({ postId, initialLiked, initialLikesCount }: LikeButtonProps) {
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isPending, startTransition] = useTransition();

    const handleLike = async () => {
        if (!session?.user?.id) {
            toast.error("You must be logged in to like a post.");
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/post/like", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId }),
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.error || "Something went wrong");
                    return;
                }

                setIsLiked(!isLiked);
                setLikesCount(data.likesCount);
            } catch (err) {
                toast.error("Failed to update like");
            }
        });
    };

    return (
        <button
            onClick={handleLike}
            disabled={isPending}
            className={`mt-6 px-4 py-2 rounded-full transition ${isLiked ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                }`}
        >
            {isLiked ? "♥ Liked" : "♡ Like"} • {likesCount}
        </button>
    );
}
