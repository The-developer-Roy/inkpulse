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

interface UserProfile {
    name: string;
    email: string;
    profilePic?: string;
    niche?: string;
    bio?: string;
}

export default function EditorClient({ user }: { user: UserProfile }) {
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
        content: "",
        immediatelyRender: false,
    });

    const router = useRouter();
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (status: "draft" | "published") => {
        if (!editor) return;

        const loadingToast = toast.loading(status === "published" ? "Publishing..." : "Saving Draft...");

        const content = editor.getHTML();
        const title = "Untitled Post" // May want a title input in the UI

        try {
            setIsSubmitting(true);

            const res = await fetch("/api/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    tags: [],
                    author: session?.user?.id,
                    status,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(status === "published" ? "Post Published." : "Draft Saved.", { id: loadingToast });
                if (status==="published") {
                    router.push(`/post/${data.data._id}`); // redirect to post page
                }
            } else {
                toast.error(data.message || status === "published" ? "Failed to Save draft..." : "Failed to publish...", { id: loadingToast });
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
                        <button className="bg-secondary rounded-md flex justify-center items-center gap-2 p-2 hover:bg-[#f4b13f]" onClick={()=>handleSubmit("draft")} disabled={isSubmitting}>
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
            </div>
        </>
    );
}
