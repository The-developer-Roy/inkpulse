import React, { useState } from 'react'
import { Dancing_Script } from 'next/font/google'
import { Poppins } from 'next/font/google';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';

const dancingScript = Dancing_Script({
    weight: "400",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: "400",
    subsets: ["latin"],
});

const Footer = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    }

    return (
        <footer className={`w-full flex justify-center items-start bg-secondary py-10 px-6 md:px-16 gap-5 ${poppins.className}`}>
            {loading && (<Spinner/>)}
            <div className='w-[25%] p-5 flex flex-col justify-center items-start gap-5'>
                <h1 className={`text-3xl ${dancingScript.className} text-black`}>Ink<span className='text-primary'>pulse</span></h1>
                <p className='text-gray-700'>A platform where stories come alive and writers thrive.</p>
                <div className='flex justify-center items-center gap-3'>
                    <Link href={"https://www.instagram.com/the_1_roy"} className='p-2 rounded-full bg-dominant'>
                        <Instagram size={20} />
                    </Link>
                    <Link href={"https://www.x.com/roysubhadeep747"} className='p-2 rounded-full bg-dominant'>
                        <Twitter size={20} />
                    </Link>
                    <Link href={"https://www.facebook.com"} className='p-2 rounded-full bg-dominant'>
                        <Facebook size={20} />
                    </Link>
                </div>
            </div>
            <div className='w-[25%] p-5 flex flex-col justify-center items-start gap-5'>
                <h1 className="text-2xl font-bold">Quick Links</h1>
                <button onClick={()=>{navigateWithSpinner("/")}}>
                    Home
                </button>
                <button onClick={()=>{navigateWithSpinner("/about")}}>
                    About Us
                </button>
                <button onClick={()=>{navigateWithSpinner("contact")}}>
                    Contact
                </button>
            </div>
            <div className='w-[25%] p-5 flex flex-col justify-center items-start gap-5'>
                <h1 className="text-2xl font-bold">Resources</h1>
                <button onClick={()=>{navigateWithSpinner("/tips")}}>
                    Writing Tips
                </button>
                <Link href={"/publishing"}>
                    Publishing Guide
                </Link>
                <button onClick={()=>{navigateWithSpinner("/guidelines")}}>
                    Community Guidelines
                </button>
                <button onClick={()=>{navigateWithSpinner("/faqs")}}>
                    FAQs
                </button>
                <button onClick={()=>{navigateWithSpinner("/support")}}>
                    Support
                </button>
            </div>
            <div className='w-[25%] p-5 flex flex-col justify-center items-start gap-5'>
                <h1 className="text-2xl font-bold">Contact Us</h1>
                <div className='flex justify-center items-center gap-2'>
                    <Mail size={20}/>
                    roysubhadeep747@gmail.com
                </div>
                <div className='flex justify-center items-center gap-2'>
                    <MapPin size={20}/>
                    SP Road Ward - 3, Lala
                </div>
                <div className='flex justify-center items-center gap-2'>
                    <Phone size={20}/>
                    +918011758618
                </div>
            </div>
        </footer >
    )
}

export default Footer
