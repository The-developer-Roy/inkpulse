"use client";

import Image from "next/image";
import { useState } from "react";
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
                        <button className="bg-secondary rounded-md flex justify-center items-center gap-2 p-2 hover:bg-[#f4b13f]">
                            <Image src="/ext_link.svg" alt="external link svg" height={25} width={25} />
                            Publish
                        </button>
                        <button className="bg-secondary rounded-md flex justify-center items-center gap-2 p-2 hover:bg-[#f4b13f]">
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
