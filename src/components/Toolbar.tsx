"use client";

import { useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import toast from "react-hot-toast";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  ImageIcon,
  Code2,
  TextQuote,
  BrushIcon,
  Heading3,
} from "lucide-react";
import { DropdownMenu } from "./DropdownMenu";
import { HexColorPicker } from "react-colorful";
import Image from "next/image";


const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const Button = ({
    onMouseDown,
    isActive,
    children,
  }: {
    onMouseDown: (e: React.MouseEvent) => void;
    isActive?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={onMouseDown}
      className={`px-4 py-2 rounded border text-sm font-medium ${isActive
        ? "bg-blue-600 text-white border-blue-700"
        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
    >
      {children}
    </button>
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const loadingToast = toast.loading("Uploading Image...");
        const file = event.target.files?.[0];
        if (!file) return toast.dismiss(loadingToast);

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64String = reader.result as string;

            try {
                const response = await fetch("/api/post/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64String }),
                });

                const data = await response.json();

                if (response.ok) {  
                    toast.success("Image Uploaded", { id: loadingToast });
                    editor.chain().focus().setImage({ src: data.imageUrl }).run();
                } else {
                    toast.error(data.error || "Upload failed", { id: loadingToast });
                }
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong", { id: loadingToast });
            }
        };

        reader.readAsDataURL(file);

        event.target.value = "";
    };

  const [color, setColor] = useState("#000000");
  const [showPicker, setShowPicker] = useState(false);
  const [alignClick, setAlignClick] = useState(false);

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
       flex flex-wrap items-center gap-2
       bg-white/60 dark:bg-gray-900/60 backdrop-blur-md
       shadow-lg rounded-xl px-4 py-2
       border border-white/20 dark:border-gray-700/50
       transition-all duration-300 w-[65%] justify-center"
    >
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().toggleBold().run();
        }}
        isActive={editor.isActive("bold")}
      >
        <Bold size={18} />
      </Button>
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().toggleItalic().run();
        }}
        isActive={editor.isActive("italic")}
      >
        <Italic size={18} />
      </Button>
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().toggleUnderline().run();
        }}
        isActive={editor.isActive("underline")}
      >
        <Underline size={18} />
      </Button>
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().unsetAllMarks().clearNodes().run();
        }}
      >
        <BrushIcon size={18} />
      </Button>
      <DropdownMenu
        button={
          <button className="p-2 rounded-md bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
            <AlignLeft size={18} />
          </button>
        }
      >
        <button
          className="w-full flex items-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 p-1 rounded-md"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
        >
          <AlignLeft size={16} /> Align Left
        </button>
        <button
          className="w-full flex items-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 p-1 rounded-md"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
        >
          <AlignCenter size={16} /> Align Center
        </button>
        <button
          className="w-full flex items-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 p-1 rounded-md"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
        >
          <AlignRight size={16} /> Align Right
        </button>
      </DropdownMenu>

      <DropdownMenu
        button={
          <button className="p-2 rounded-md bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
            <Heading1 size={18} />
          </button>
        }
      >
        <button
          className="w-full flex items-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 p-1 rounded-md"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
        >
          <Heading1 size={16} /> Heading 1
        </button>
        <button
          className="w-full flex items-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 p-1 rounded-md"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <Heading2 size={16} /> Heading 2
        </button>
        <button
          className="w-full flex items-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 p-1 rounded-md"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
        >
          <Heading3 size={16} /> Heading 3
        </button>
      </DropdownMenu>

      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().setParagraph().run();
        }}
        isActive={editor.isActive("paragraph")}
      >
        <TextQuote size={18} />
      </Button>
      <Button onMouseDown={(e) => {e.preventDefault(); setShowPicker(!showPicker); editor.chain().setColor(color).run()}}>
        <Image src={"/A.svg"} alt="a" height={20} width={20} />
        <hr className="h-1" style={{ backgroundColor: color }} />
      </Button>

      {/* Color picker*/}
      {showPicker && (
        <div className="absolute bottom-[100%] left-[50%] bg-white p-2 rounded shadow-lg z-50">
          <HexColorPicker color={color} onChange={
            (newColor)=>{
              setColor(newColor);
              editor.chain().focus().setColor(newColor).run();
            }
          } />
        </div>
      )}
      <div onMouseDown={(e)=>{e.preventDefault(); fileInputRef.current?.click();}} className="cursor-pointer px-4 py-2 rounded border text-sm font-medium bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
        <ImageIcon size={18} />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        isActive={editor.isActive("bulletList")}
      >
        <List size={18} />
      </Button>
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        isActive={editor.isActive("orderedList")}
      >
        <ListOrdered size={18} />
      </Button>
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("Enter a URL", previousUrl);

          if (url === null) return; // user cancelled
          if (url === "") {
            // Remove link
            editor.chain().focus().unsetLink().run();
            return;
          }

          // Set link
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
        isActive={editor.isActive("link")}
      >
        <Link2 size={18} />
      </Button>
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }}
        isActive={editor.isActive("codeBlock")}
      >
        <Code2 size={18} />
      </Button>
    </div>
  );
};

export default Toolbar;
