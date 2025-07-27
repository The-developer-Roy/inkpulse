"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { default as TipImage } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import "./editor.css"
import Toolbar from "@/components/Toolbar";
import toast from "react-hot-toast";
import EditorSetupModal from "@/components/EditorSetupModal";
import ThumbnailUploadModal from "@/components/ThumbNailUploadModal";

interface UserProfile {
    name: string;
    email: string;
    profilePic?: string;
    niche?: string;
    bio?: string;
}

interface existingPost{
    _id: string;
    title: string;
    content: string;
    tags: string[];
    status: "draft" | "published";
}

export default function EditorClient({ user, existingPost }: { user: UserProfile, existingPost?: existingPost }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: "text-left", // default text alignment
                    },
                },
            }).extend({
                // Override the `addExtensions` method  to execute the link extension
                addExtensions() {
                    return this.parent?.().filter(
                        (ext) => ext.name !== "link" // Remove built-in link
                    ) ?? [];
                },
            }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"], // allow aligning these
            }),
            TextStyle.configure(),
            Color.configure(),
            TipImage,
            Link.configure({
                openOnClick: true,
                autolink: false,
                linkOnPaste: true,
            })
        ],
        content: existingPost?.content || "",
        editorProps: { attributes: { class: "editor-content" } },
        onCreate: ()=>{
            if(existingPost) {
                localStorage.setItem("post_title", existingPost.title);
                localStorage.setItem("post_tags", JSON.stringify(existingPost.tags));
                setpostInfo({ title: existingPost.title, tags: existingPost.tags });
            }
        },
        immediatelyRender: false,
    });

    const router = useRouter();
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [postInfo, setpostInfo] = useState<null | { title: string; tags: string[] }>(null);
    const [showThumbnailModal, setShowThumbnailModal] = useState(false);
    const [newPostId, setNewPostId] = useState<string | null>(null);

    const handleModalSubmit = (data: { title: string; tags: string[] }) => {
        setpostInfo(data);
    };

    const handleSubmit = async (status: "draft" | "published") => {
        if (!editor) return;

        const loadingToast = toast.loading(status === "published" ? "Publishing..." : "Saving Draft...");

        const content = editor.getHTML();

        // Get title and tags from localStorage
        const title = localStorage.getItem("post_title");
        const tagsRaw = localStorage.getItem("post_tags");
        let tags: string[] = [];

        try {
            if (tagsRaw) {
                tags = JSON.parse(tagsRaw);
            }
        } catch (err) {
            console.warn("Failed to parse tags from localStorage", err);
        }

        try {
            setIsSubmitting(true);

            const method = existingPost ? "PUT" : "POST";
            const url = existingPost ? `/api/post?id=${existingPost._id}` : "/api/post";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    tags,
                    author: session?.user?.id,
                    status,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(status === "published" ? "Post Published." : "Draft Saved.", { id: loadingToast });
                localStorage.removeItem("post_title");
                localStorage.removeItem("post_tags");
                if (status === "published") {
                    setNewPostId(data.data._id); // Save the MongoDB ObjectId
                    setShowThumbnailModal(true);
                }
            } else {
                toast.error(data.message || status === "published" ? "Failed to Publish..." : "Failed to save draft...", { id: loadingToast });
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong :(", { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="w-full h-full flex justify-around items-center flex-col gap-4 p-4">
                {!postInfo && <EditorSetupModal onSubmit={handleModalSubmit} />}
                {postInfo && (
                    <>
                        <div className="flex justify-around items-center w-full">
                            <div className="flex justify-center items-center gap-2">
                                {user.profilePic && (
                                    <Image
                                        src={user.profilePic}
                                        alt={`${user.name}'s profile pic`}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                )}
                                <h3 className="text-xl">{user.name}</h3>
                            </div>
                            <div className="flex justify-center items-center gap-4">
                                <button className="bg-secondary rounded-md flex justify-center items-center gap-2 p-2 hover:bg-[#f4b13f]" onClick={() => handleSubmit("published")} disabled={isSubmitting}>
                                    <Image src="/ext_link.svg" alt="external link svg" height={25} width={25} />
                                    Publish
                                </button>
                                <button className="bg-secondary rounded-md flex justify-center items-center gap-2 p-2 hover:bg-[#f4b13f]" onClick={() => handleSubmit("draft")} disabled={isSubmitting}>
                                    <Image src="/save.svg" alt="save svg" height={25} width={25} />
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className="w-[794px] flex flex-col justify-center items-center">
                            <Toolbar editor={editor} />
                            <div className="pages-container" onDrop={(e) => e.preventDefault()} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}>
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                    </>
                )}
                {showThumbnailModal && newPostId && (<ThumbnailUploadModal postId={newPostId} onClose={()=>{setShowThumbnailModal(false); router.push(`/post/${newPostId}`);}}/>)}
            </div>
        </>
    );
}
