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
        <footer className={`w-full flex flex-col lg:flex-row justify-center items-start bg-secondary py-8 lg:py-10 px-4 sm:px-6 md:px-16 gap-8 lg:gap-5 ${poppins.className}`}>
            {loading && (<Spinner />)}

            {/* Brand Section */}
            <div className='w-full lg:w-[25%] p-3 lg:p-5 flex flex-col justify-center items-center lg:items-start gap-4 lg:gap-5'>
                <h1 className={`text-2xl sm:text-3xl ${dancingScript.className} text-black text-center lg:text-left`}>Ink<span className='text-primary'>pulse</span></h1>
                <p className='text-gray-700 text-center lg:text-left text-sm sm:text-base'>A platform where stories come alive and writers thrive.</p>
                <div className='flex justify-center items-center gap-3'>
                    <Link href={"https://www.instagram.com/the_1_roy"} className='p-2 rounded-full bg-dominant hover:scale-110 transition-transform duration-200'>
                        <Instagram size={20} />
                    </Link>
                    <Link href={"https://www.x.com/roysubhadeep747"} className='p-2 rounded-full bg-dominant hover:scale-110 transition-transform duration-200'>
                        <Twitter size={20} />
                    </Link>
                    <Link href={"https://www.facebook.com"} className='p-2 rounded-full bg-dominant hover:scale-110 transition-transform duration-200'>
                        <Facebook size={20} />
                    </Link>
                </div>
            </div>

            {/* Quick Links Section */}
            <div className='w-full lg:w-[25%] p-3 lg:p-5 flex flex-col justify-center items-center lg:items-start gap-4 lg:gap-5'>
                <h1 className="text-xl sm:text-2xl font-bold text-center lg:text-left">Quick Links</h1>
                <div className='flex flex-col gap-3 items-center lg:items-start'>
                    <button onClick={() => { navigateWithSpinner("/") }} className='hover:text-primary transition-colors duration-200 text-sm sm:text-base'>
                        Home
                    </button>
                    <button onClick={() => { navigateWithSpinner("/about") }} className='hover:text-primary transition-colors duration-200 text-sm sm:text-base'>
                        About Us
                    </button>
                    <button onClick={() => { navigateWithSpinner("contact") }} className='hover:text-primary transition-colors duration-200 text-sm sm:text-base'>
                        Contact
                    </button>
                </div>
            </div>

            {/* Resources Section */}
            <div className='w-full lg:w-[25%] p-3 lg:p-5 flex flex-col justify-center items-center lg:items-start gap-4 lg:gap-5'>
                <h1 className="text-xl sm:text-2xl font-bold text-center lg:text-left">Resources</h1>
                <div className='flex flex-col gap-3 items-center lg:items-start'>
                    <button onClick={() => { navigateWithSpinner("/tips") }} className='hover:text-primary transition-colors duration-200 text-sm sm:text-base'>
                        Writing Tips
                    </button>
                    <Link href={"/publishing"} className='hover:text-primary transition-colors duration-200 text-sm sm:text-base'>
                        Publishing Guide
                    </Link>
                    <button onClick={() => { navigateWithSpinner("/guidelines") }} className='hover:text-primary transition-colors duration-200 text-sm sm:text-base'>
                        Community Guidelines
                    </button>
                    <button onClick={() => { navigateWithSpinner("/faqs") }} className='hover:text-primary transition-colors duration-200 text-sm sm:text-base'>
                        FAQs
                    </button>
                    <button onClick={() => { navigateWithSpinner("/support") }} className='hover:text-primary transition-colors duration-200 text-sm sm:text-base'>
                        Support
                    </button>
                </div>
            </div>

            {/* Contact Section */}
            <div className='w-full lg:w-[25%] p-3 lg:p-5 flex flex-col justify-center items-center lg:items-start gap-4 lg:gap-5'>
                <h1 className="text-xl sm:text-2xl font-bold text-center lg:text-left">Contact Us</h1>
                <div className='flex flex-col gap-3 items-center lg:items-start'>
                    <div className='flex justify-center lg:justify-start items-center gap-2 text-sm sm:text-base'>
                        <Mail size={18} className='flex-shrink-0' />
                        <span className='break-all text-center lg:text-left'>roysubhadeep747@gmail.com</span>
                    </div>
                    <div className='flex justify-center lg:justify-start items-center gap-2 text-sm sm:text-base'>
                        <MapPin size={18} className='flex-shrink-0' />
                        <span className='text-center lg:text-left'>SP Road Ward - 3, Lala</span>
                    </div>
                    <div className='flex justify-center lg:justify-start items-center gap-2 text-sm sm:text-base'>
                        <Phone size={18} className='flex-shrink-0' />
                        <span>+918011758618</span>
                    </div>
                </div>
            </div>
        </footer >
    )
}

export default Footer