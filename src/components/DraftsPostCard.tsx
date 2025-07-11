"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { convert } from "html-to-text";
import { Trash2, PenSquare } from "lucide-react";

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

interface Props {
    post: DraftPost;
    onDelete: (id: string) => void;
}

const DraftPostCard: React.FC<Props> = ({ post, onDelete }) => {

    const cleanContent = convert(post.content, {
        wordwrap: false,
        selectors: [
            { selector: 'img', format: 'skip' }, // skip images
        ],
    });

    const previewContent = cleanContent.length >= 200 ? `${cleanContent.slice(0, 200)}...` : cleanContent;

    const router = useRouter();

    const handleEdit = () => {
        router.push(`/editor?id=${post._id}`);
    };

    const handleDelete = async (postId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this draft?");
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/post?id=${postId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Draft deleted successfully.");
                onDelete(post._id);
            } else {
                toast.error("Failed to delete draft.");
            }
        } catch (error) {
            toast.error("Something went wrong.");
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-2xl mx-auto mb-6">
            <div className="flex items-center gap-3 mb-3">
                {post.author.profilePic && (
                    <Image
                        src={post.author.profilePic}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                )}
                <span className="font-medium text-gray-700">{post.author.name}</span>
            </div>

            <h2 className="text-2xl font-semibold text-black mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{previewContent}</p>
            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <PenSquare size={20}/>
                </button>
                <button
                    onClick={()=>{handleDelete(post._id)}}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ease-in-out"
                >
                    <Trash2 size={20}/>
                </button>
            </div>
        </div>
    );
};

export default DraftPostCard;
