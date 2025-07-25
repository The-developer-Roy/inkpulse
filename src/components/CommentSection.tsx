"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Comment = {
    _id: string;
    content: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
};

type CommentSectionProps = {
    postId: string;
    currentUserId?: string; // Logged-in user's ID
};

export default function CommentSection({ postId, currentUserId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch comments
    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comment?postId=${postId}`);
            const data = await res.json();
            if (res.ok) {
                setComments(data.data || []);
            } else {
                setComments([]);
            }
        } catch (err) {
            console.error("Failed to fetch comments", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // Add a new comment
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!currentUserId) {
            alert("You need to be logged in to comment.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, userId: currentUserId, content: newComment }),
            });

            if (res.ok) {
                const data = await res.json();
                setNewComment("");
                // Add new comment at the top with animation
                setComments((prev) => [data.data, ...prev]);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to post comment");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Delete comment
    const handleDeleteComment = async (commentId: string) => {
        try {
            const res = await fetch(`/api/comment?commentId=${commentId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setComments((prev) => prev.filter((c) => c._id !== commentId));
            } else {
                alert("Failed to delete comment");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="mt-8 bg-white shadow rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            {/* Add Comment */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 mb-6">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </form>

            {/* Display Comments */}
            {comments.length > 0 ? (
                <ul className="space-y-3">
                    <AnimatePresence>
                        {comments.map((comment) => (
                            <motion.li
                                key={comment._id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.3 }}
                                className="flex justify-between items-center border-b pb-2"
                            >
                                <div>
                                    <p className="font-semibold">{comment.userId?.name || "Unknown"}</p>
                                    <p className="text-gray-700">{comment.content}</p>
                                    <small className="text-gray-400 text-xs">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </small>
                                </div>
                                {comment.userId && currentUserId === comment.userId._id && (
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            ) : (
                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
}
