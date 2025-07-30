"use client"

import React, { useState } from 'react'
import { Dancing_Script } from 'next/font/google';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


const dancingScript = Dancing_Script({
    weight: ["400"],
    subsets: ["latin"],
});

const emojis = ["✨", "🎇", "🎆", "🎉", "🎊"];

const Setup_profile = () => {
    const router = useRouter();
    const [wobble, setWobble] = useState(false);
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [niche, setNiche] = useState("default");
    const [bio, setBio] = useState("");

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const loadingToast = toast.loading("Uploading Image...");
        const file = event.target.files?.[0];
        if (!file) return toast.dismiss(loadingToast);

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64String = reader.result as string;

            try {
                const response = await fetch("/api/profile/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64String }),
                });

                const data = await response.json();

                if (response.ok) {
                    setProfilePic(data.imageUrl); // ✅ Set actual Cloudinary URL now
                    toast.success("Image Uploaded", { id: loadingToast });
                } else {
                    toast.error(data.error || "Upload failed", { id: loadingToast });
                }
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong", { id: loadingToast });
            }
        };

        reader.readAsDataURL(file);
    };


    const handleSetup = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget as HTMLButtonElement | null;
        if (!button) return;

        try {
            const res = await fetch("/api/profile/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    profilePic,
                    niche,
                    bio,
                }),
            });

            const data = await res.json();
            if (data.success) {
                router.push("/"); // Redirect after success
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        }

        setWobble(true);
        setTimeout(() => setWobble(false), 600);

        const buttonRect = button.getBoundingClientRect();

        for (let i = 0; i < 5; i++) {
            const emoji = document.createElement("span");
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.classList.add("emoji-animation");

            const x = Math.random() * buttonRect.width - buttonRect.width / 2;
            const y = Math.random() * buttonRect.height - buttonRect.height / 2;

            emoji.style.position = "absolute";
            emoji.style.left = `${button.offsetWidth / 2 + x}px`;
            emoji.style.top = `${button.offsetHeight / 2 + y}px`;
            emoji.style.fontSize = "20px";
            emoji.style.opacity = "1";
            emoji.style.transition = "transform 0.8s ease-out, opacity 0.8s";

            button.appendChild(emoji);

            setTimeout(() => {
                emoji.style.transform = `translate(${x * 2}px, ${y * 2}px) scale(1.5)`;
                emoji.style.opacity = "0";
            }, 50);

            setTimeout(() => emoji.remove(), 900);
        }
    };



    return (
        <div className={`${dancingScript.className} min-h-screen w-full flex justify-center items-center p-5 flex-col gap-5`}>
            <h1 className='text-4xl'>Setup Your Profile</h1>
            <div className='h-[30%] w-[11%] flex justify-center items-center flex-col gap-5'>
                <input type="file" name="profile_pic_selector" id="profile_pic_selector" className='hidden' onChange={handleImageUpload} />
                <label htmlFor="profile_pic_selector" className='bg-primary rounded-full h-[150px] w-[150px] p-5 flex justify-center items-center cursor-pointer hover:bg-[#e0dfdd] '><Upload size={50} className='' /></label>
                <span className='text-xl'>Profile Picture</span>
            </div>
            <input
                type="text"
                placeholder="Enter Your Name..."
                className="p-2 w-[70%] h-12  rounded-md placeholder:text-[#565656] outline-none"
                onChange={(e) => setName(e.target.value)}
            />
            <select name="genres" id="genres" className='p-2 w-[70%] h-14 rounded-md outline-none' onChange={(e) => setNiche(e.target.value)}>
                <option className='text-[#565656]' value={"default"}>Select Your Niche...</option>
                <option value={"cooking"}>Cooking</option>
                <option value={"technology"}>Technology</option>
                <option value={"writing"}>Writing</option>
                <option value={"film-making"}>Film making</option>
                <option value={"others"}>Others</option>
            </select>
            <textarea name="bio" id="bio" placeholder='Fill your bio' className='p-2 w-[70%] min-h-[200px]  rounded-md placeholder:text-[#565656] outline-none' onChange={(e) => setBio(e.target.value)}></textarea>
            <div className="flex gap-4">
                <button className={`group relative min-h-[50px] w-40 overflow-hidden bg-dominant text-black drop-shadow-[0px_6px_10px] transition-all before:absolute before:left-0 before:top-0 before:h-0 before:w-1/4 before:bg-[#FFB433] before:duration-500 after:absolute after:bottom-0 after:right-0 after:h-0 after:w-1/4 after:bg-[#FFB433] after:duration-500 hover:text-black hover:before:h-full hover:after:h-full rounded-full ${wobble ? "animate-wobble" : ""}`} onClick={handleSetup}>
                    <span className="top-0 flex h-full w-full items-center justify-center before:absolute before:bottom-0 before:left-1/4 before:z-0 before:h-0 before:w-1/4 before:bg-[#FFB433] before:duration-500 after:absolute after:right-1/4 after:top-0 after:z-0 after:h-0 after:w-1/4 after:bg-[#FFB433] after:duration-500 hover:text-black group-hover:before:h-full group-hover:after:h-full"></span>
                    <span className="absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center group-hover:text-black text-2xl">Setup</span>
                </button>
            </div>
        </div>
    )
}

export default Setup_profile;