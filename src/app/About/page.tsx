import React from 'react'
import { Dancing_Script } from 'next/font/google'
import { Playfair_Display } from 'next/font/google';
import { Poppins } from 'next/font/google';

const dancingScript = Dancing_Script({
    weight: "400",
    subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
    weight: "400",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: "400",
    subsets: ["latin"],
});

const About = () => {
    return (
        <main className={`p-20 flex justify-center items-start flex-col gap-10 ${poppins.className}`}>
            <section className='flex flex-col justify-center items-start gap-5'>
                <h1 className='text-5xl'>
                    🖋️ About <span className={`${dancingScript.className} text-secondary`}>Inkpulse</span>
                </h1>
                <div className='flex flex-col justify-center items-start gap-5'>
                    <h2 className='text-4xl font-bold'>Where Words Find their Wings</h2>
                    <p className='text-lg'>
                        Welcome to <span className={`${dancingScript.className}`}>Inkpulse</span> — a space crafted for dreamers, storytellers, readers, and rebels of imagination. We believe that stories are more than entertainment — they’re how we connect, heal, grow, and spark change.
                    </p>
                </div>
            </section>
            <hr className='bg-gray-600 h-[2px] w-[100%] outline-none border-none' />
            <section className='flex flex-col justify-center items-start gap-5'>
                <h2 className='text-4xl font-bold'>🌍 Our Story</h2>
                <p className='text-lg'>
                    Inkpulse was born from a simple idea:
                </p>

                <p className={`text-xl font-bold ${playfairDisplay.className} p-10 flex justify-start items-center h-20 w-[100%] border-l-4 border-l-gray-700`}>
                    &quot;What if anyone with a story could share it with the world — freely, beautifully, and without barriers?&quot;
                </p>

                <p className='text-lg'>
                    Tired of traditional publishing gates and impersonal platforms, we set out to build something different — a creative ecosystem where writers are celebrated, readers are valued, and every story matters.

                    Since our launch, we&apos;ve grown into a dynamic global community — from young poets in Delhi to seasoned fantasy authors in London, from casual weekend readers to late-night binge writers.
                </p>
            </section>
            <hr className='bg-gray-600 h-[2px] w-[100%] outline-none border-none' />
            <section className='flex flex-col justify-center items-start gap-5'>
                <h2 className='text-4xl font-bold'>🎯 Our Mission</h2>
                <p className='text-lg'>
                    To empower storytellers of all kinds by giving them a platform that celebrates creativity, nurtures growth, and connects them to a passionate audience.
                    <br />
                    <br />
                    Whether it’s a short poem, a multi-part novel, or a real-life reflection — your voice belongs here.
                </p>
            </section>
            <hr className='bg-gray-600 h-[2px] w-[100%] outline-none border-none' />
            <section className='flex flex-col justify-center items-start gap-5'>
                <h2 className='text-4xl font-bold'>💡 What We Value</h2>
                <ul className='flex flex-col justify-center items-start gap-5'>
                    <li>
                        <h2 className='text-2xl font-bold'>Creativity</h2>
                        <p className='text-lg'>We celebrate originality. Every story shared on Inkpulse is a spark of imagination that contributes to a richer world.</p>
                    </li>
                    <li>
                        <h2 className='text-2xl font-bold'>Authenticity</h2>
                        <p className='text-lg'>
                            Be real. Be vulnerable. Be bold. Inkpulse is a safe space for expression in all its raw, beautiful forms.
                        </p>
                    </li>
                    <li>
                        <h2 className='text-2xl font-bold'>Community</h2>
                        <p className='text-lg'>
                            We’re not just a platform; we’re a family of readers and writers who support and uplift each other.
                        </p>
                    </li>
                    <li>
                        <h2 className='text-2xl font-bold'>Access for All</h2>
                        <p className='text-lg'>
                            Everyone deserves the chance to write, read, and grow — regardless of background, experience, or genre.
                        </p>
                    </li>
                </ul>
            </section>
            <hr className='bg-gray-600 h-[2px] w-[100%] outline-none border-none' />
            <section className='flex flex-col justify-center items-start gap-5'>
                <h2 className='text-4xl font-bold'>🧑‍🤝‍🧑 Who Is Inkpulse For?</h2>
                <ul className='list-disc ml-10 text-lg'>
                    <li>Aspiring Writers who want to start publishing and find their audience.</li>
                    <li>Experienced Authors seeking more freedom and reader connection.</li>
                    <li>Avid Readers looking for fresh, engaging stories in every genre.</li>
                    <li>Creative Explorers who believe in the power of storytelling.</li>
                </ul>
            </section>
            <hr className='bg-gray-600 h-[2px] w-[100%] outline-none border-none' />
            <section className='flex flex-col justify-center items-start gap-5'>
                <h2 className='text-4xl font-bold'>🚀 Our Vision for the Future</h2>
                <p className='text-lg'>
                    We’re just getting started.
                    <br />
                    <br />
                    In the coming months and years, we’re expanding with tools for monetization, audio storytelling, writer workshops, and AI-powered story coaching. Our goal is simple: to become the most writer-first platform on the web.
                    <br />
                    <br />
                    If you have a story to tell — <span className='font-bold'>this is your sign to begin.</span>
                </p>
            </section>
            <hr className='bg-gray-600 h-[2px] w-[100%] outline-none border-none' />
            <section className='flex flex-col justify-center items-start gap-5'>
                <h2 className='text-4xl font-bold'>🤝 Join the Movement</h2>
                <p className='text-lg'>
                    Whether you’re here to <span className='font-bold'>write</span>, <span className='font-bold'>read</span>, or <span className='font-bold'>simply be inspired</span>, Inkpulse welcomes you.
                    <br />
                    <br />
                    Together, let’s make storytelling more <span className='font-bold'>inclusive</span>, <span className='font-bold'>personal</span>, and <span className='font-bold'>alive</span> than ever before.
                </p>
            </section>
            <hr className='bg-gray-600 h-[2px] w-[100%] outline-none border-none' />
            <section className='flex flex-col justify-center items-start gap-5'>
                <h2 className='text-4xl font-bold'>💌 Want to Connect?</h2>
                <p className='text-lg'>
                    Have questions, feedback, or ideas? We&apos;d love to hear from you.
                </p>
                <ul>
                    <li>
                        📧 Email us at: <a href="mailto:roysubhadeep747@gmail.com" className='text-blue-700 hover:text-blue-500'>roysubhadeep747@gmail.com</a>
                    </li>
                    <li>
                        📣 Follow us: <a href="https://www.linkedin.com/in/subhadeep-roy-6b8714285/" className='text-blue-700 hover:text-blue-500'>LinkedIn</a>
                    </li>
                </ul>
            </section>
            <hr className='bg-gray-600 h-[2px] w-[100%] outline-none border-none' />
            <section className='flex flex-col justify-center items-start gap-5'>
                <h2 className='text-4xl font-bold'>🧡 From all of us at Inkpulse</h2>
                <p className='text-lg'>
                    Thank you for believing in stories.
                </p>
            </section>
        </main>
    )
}

export default About
