'use client'

import React, { useState } from 'react'
import Navbar from './Navbar'
import { Dancing_Script, Poppins } from 'next/font/google'
import { TypeAnimation } from 'react-type-animation'
import { Clapperboard, Ellipsis, Heart, Sparkles, Star, Swords, TestTubeDiagonal, VenetianMask } from 'lucide-react'
import Image from 'next/image'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import Spinner from './Spinner'

const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });
const poppins = Poppins({ weight: '400', subsets: ['latin'] });

const UnauthenticatedHome = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    }

    return (
        <main className={`custom-cursor min-h-screen w-full flex justify-center items-center flex-col overflow-x-hidden ${poppins.className}`}>
            {loading && (<Spinner/>)}
            <Navbar variant="unauthenticated" setLoading={setLoading}/>

            {/* HERO SECTION */}
            <section className="w-full min-h-screen flex justify-center items-center pt-20 sm:pt-28 lg:pt-36 px-4 sm:px-6 md:px-16">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full h-full justify-center items-center">
                    {/* Left Text Content */}
                    <div className="flex flex-col gap-4 max-w-xl lg:w-1/2 animate-fade-in justify-center items-start text-center lg:text-left">
                        <span className={`${dancingScript.className} text-4xl sm:text-5xl md:text-6xl lg:text-8xl`}>Inkpulse</span>
                        <TypeAnimation
                            sequence={['Read.', 2000, 'Write.', 2000, 'Connect.', 2000]}
                            wrapper="span"
                            cursor
                            repeat={Infinity}
                            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#FFB433', fontWeight: 'bold' }}
                        />
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-2">
                            Discover, create, and share captivating stories from writers around the world. Your next favorite story is just a click away.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 text-base sm:text-lg w-full sm:w-auto">
                            <button onClick={()=>{navigateWithSpinner("/auth/signin")}} className="bg-secondary px-4 sm:px-6 py-3 rounded-full shadow-md hover:bg-dominant transition-all duration-300">
                                Read Stories
                            </button>
                            <button onClick={()=>{navigateWithSpinner("/auth/signin")}} className="bg-secondary px-4 sm:px-6 py-3 rounded-full shadow-md hover:bg-dominant transition-all duration-300">
                                Publish Stories
                            </button>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center animate-fade-in delay-100 mt-6 lg:mt-0">
                        <svg className="w-full max-w-xs sm:max-w-sm md:max-w-md" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* [SVG content stays unchanged] */}
                            <rect x="100" y="50" width="300" height="300" rx="10" fill="#FBF8EF" />
                            <rect x="120" y="80" width="260" height="20" rx="4" fill="#B4EBE6" />
                            <rect x="120" y="110" width="200" height="10" rx="2" fill="#80CBC4" />
                            <rect x="120" y="130" width="180" height="10" rx="2" fill="#80CBC4" />
                            <rect x="120" y="150" width="220" height="10" rx="2" fill="#80CBC4" />
                            <rect x="120" y="180" width="260" height="20" rx="4" fill="#B4EBE6" />
                            <rect x="120" y="210" width="200" height="10" rx="2" fill="#80CBC4" />
                            <rect x="120" y="230" width="180" height="10" rx="2" fill="#80CBC4" />
                            <rect x="120" y="250" width="220" height="10" rx="2" fill="#80CBC4" />
                            <rect x="120" y="280" width="260" height="20" rx="4" fill="#B4EBE6" />
                            <rect x="120" y="310" width="100" height="10" rx="2" fill="#80CBC4" />
                            <circle cx="380" cy="310" r="20" fill="#FFB433" />
                            <path d="M375 310L380 315L385 305" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* FEATURES / VALUE SECTION */}
            <section className="w-full flex justify-center items-center bg-primary py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-16">
                <div className="max-w-6xl w-full flex flex-col gap-6 sm:gap-8 animate-fade-in text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                        Why <span className={`text-secondary ${dancingScript.className}`}>Inkpulse?</span>
                    </h1>

                    <div>
                        <TypeAnimation
                            sequence={['Read Stories That Move You.', 11000, 'Publish with Ease.', 11000, 'Engage & Connect', 11000, 'Grow as a Writer', 11000, 'Built for Discovery', 11000,]}
                            wrapper="h2"
                            cursor
                            repeat={Infinity}
                            speed={75}
                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight"
                        />
                    </div>

                    <div className="h-32 sm:h-28 md:h-auto">
                        <TypeAnimation
                            sequence={[
                                'Explore thousands of stories across genres — fantasy, romance, thriller, sci-fi, and more — all written by passionate creators from around the world.',
                                7000,
                                'Got a story to tell? Publish it in minutes. Reach a global audience and build your own community of readers and fans.',
                                7000,
                                'Comment on chapters, follow your favorite authors, and be part of lively discussions. Inkpulse isn\'t just a platform — it\'s a creative circle.',
                                7000,
                                'Access tools, insights, and challenges to improve your writing. Receive feedback from real readers and evolve your storytelling voice.',
                                7000,
                                'Get discovered with our smart recommendation engine and trending sections. Your story deserves to be read — and we help make it happen.'
                            ]}
                            wrapper="p"
                            cursor
                            repeat={Infinity}
                            speed={75}
                            className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mt-4"
                            style={{ minHeight: "7rem" }}
                        />
                    </div>
                </div>
            </section>

            <section className='w-full flex justify-center items-center bg-background py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-16 flex-col gap-5'>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl text-center'>How <span className={`${dancingScript.className} text-secondary`}>Inkpulse</span> Works</h1>
                <p className='text-gray-700 text-center max-w-2xl'>Join our community of storytellers and readers in just a few simple steps.</p>
                <div className='flex flex-col lg:flex-row justify-center items-center gap-5 w-full max-w-6xl'>
                    <div className='w-full lg:w-[30%] p-6 lg:p-10 bg-secondary flex justify-center items-center rounded-xl flex-col gap-5'>
                        <div className='rounded-full bg-dominant w-12 h-12 sm:w-16 sm:h-16 flex justify-center items-center text-lg sm:text-xl font-bold'>1</div>
                        <h2 className='text-xl sm:text-2xl text-dominant font-bold text-center'>Create an Account</h2>
                        <p className='text-primary text-center text-sm sm:text-base'>Sign up for free and set up your profile to join our vibrant community of storytellers and readers.</p>
                    </div>
                    <div className='w-full lg:w-[30%] p-6 lg:p-10 bg-secondary flex justify-center items-center rounded-xl flex-col gap-5'>
                        <div className='rounded-full bg-dominant w-12 h-12 sm:w-16 sm:h-16 flex justify-center items-center text-lg sm:text-xl font-bold'>2</div>
                        <h2 className='text-xl sm:text-2xl text-dominant font-bold text-center'>Discover or Create</h2>
                        <p className='text-primary text-center text-sm sm:text-base'>Browse through thousands of stories or start writting your own masterpiece using our intuitive editor.</p>
                    </div>
                    <div className='w-full lg:w-[30%] p-6 lg:p-10 bg-secondary flex justify-center items-center rounded-xl flex-col gap-5'>
                        <div className='rounded-full bg-dominant w-12 h-12 sm:w-16 sm:h-16 flex justify-center items-center text-lg sm:text-xl font-bold'>3</div>
                        <h2 className='text-xl sm:text-2xl text-dominant font-bold text-center'>Connect & Grow</h2>
                        <p className='text-primary text-center text-sm sm:text-base'>Engage with other writers, recieve feedback, and watch your audience grow as you share your stories.</p>
                    </div>
                </div>
            </section>

            <section className='w-full flex justify-center items-center bg-dominant py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-16 flex-col gap-5'>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl text-center'>Explore Genres</h1>
                <p className='text-gray-700 text-center max-w-2xl'>Find stories that match your inerests from our diverse collection of genres.</p>
                <div className='flex flex-wrap justify-center items-center gap-3 sm:gap-5 lg:gap-10 w-full max-w-6xl'>
                    <div className='bg-primary flex flex-col justify-center items-center gap-3 rounded-xl p-3 sm:p-4 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[14%] min-w-[120px]'>
                        <div className='rounded-full bg-background p-2'>
                            <Sparkles size={20} />
                        </div>
                        <span className='text-secondary text-sm sm:text-base'>Fantasy</span>
                    </div>
                    <div className='bg-primary flex flex-col justify-center items-center gap-3 rounded-xl p-3 sm:p-4 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[14%] min-w-[120px]'>
                        <div className='rounded-full bg-background p-2'>
                            <VenetianMask size={20} />
                        </div>
                        <span className='text-secondary text-sm sm:text-base'>Mystery</span>
                    </div>
                    <div className='bg-primary flex flex-col justify-center items-center gap-3 rounded-xl p-3 sm:p-4 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[14%] min-w-[120px]'>
                        <div className='rounded-full bg-background p-2'>
                            <Heart size={20} />
                        </div>
                        <span className='text-secondary text-sm sm:text-base'>Romance</span>
                    </div>
                    <div className='bg-primary flex flex-col justify-center items-center gap-3 rounded-xl p-3 sm:p-4 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[14%] min-w-[120px]'>
                        <div className='rounded-full bg-background p-2'>
                            <Swords size={20} />
                        </div>
                        <span className='text-secondary text-sm sm:text-base'>Action</span>
                    </div>
                    <div className='bg-primary flex flex-col justify-center items-center gap-3 rounded-xl p-3 sm:p-4 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[14%] min-w-[120px]'>
                        <div className='rounded-full bg-background p-2'>
                            <TestTubeDiagonal size={20} />
                        </div>
                        <span className='text-secondary text-sm sm:text-base'>Sci-Fi</span>
                    </div>
                    <div className='bg-primary flex flex-col justify-center items-center gap-3 rounded-xl p-3 sm:p-4 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[14%] min-w-[120px]'>
                        <div className='rounded-full bg-background p-2'>
                            <Clapperboard size={20} />
                        </div>
                        <span className='text-secondary text-sm sm:text-base'>Drama</span>
                    </div>
                    <div className='bg-primary flex flex-col justify-center items-center gap-3 rounded-xl p-3 sm:p-4 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[14%] min-w-[120px]'>
                        <div className='rounded-full bg-background p-2'>
                            <Ellipsis size={20} />
                        </div>
                        <span className='text-secondary text-sm sm:text-base'>And More</span>
                    </div>
                </div>
            </section>

            <section className='w-full flex justify-center items-center bg-primary py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-16 flex-col gap-5'>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl text-center'>What Our Community Says</h1>
                <p className='text-gray-700 text-center max-w-2xl'>Hear from writers and readers who have found their home at Inkpulse</p>
                <div className='flex flex-col lg:flex-row justify-center items-center gap-5 w-full max-w-6xl'>
                    <div className='flex justify-center items-center gap-2 w-full lg:w-[30%] bg-dominant rounded-xl flex-col p-5'>
                        <div className='flex justify-center items-center gap-2'>
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                        </div>
                        <p className='text-gray-700 text-center text-sm sm:text-base'>"Inkpulse transformed my writting journey. The feedback I've recieved has been invaluable, and I've connected with readers from around the world. My confidence as a writer has grown tremendously."</p>
                        <div className='flex justify-center items-center gap-3 mt-2'>
                            <Image src={'/marcus.jpeg'} alt='marcus' width={48} height={48} className='rounded-full' />
                            <div className='flex justify-center items-center flex-col'>
                                <span className='font-medium'>Marcus Chen</span>
                                <span className='text-sm text-gray-700'>Fantasy Writer</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center gap-2 w-full lg:w-[30%] bg-dominant rounded-xl flex-col p-5'>
                        <div className='flex justify-center items-center gap-2'>
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                        </div>
                        <p className='text-gray-700 text-center text-sm sm:text-base'>"As an avid reader, finding Inkpulse was like discovering a treasure trove. The diversity of stories and the ability to interact directly with authors has made reading a much more immersive experience."</p>
                        <div className='flex justify-center items-center gap-3 mt-2'>
                            <Image src={'/sarah.jpeg'} alt='sarah' width={48} height={48} className='rounded-full' />
                            <div className='flex justify-center items-center flex-col'>
                                <span className='font-medium'>Sarah Johnson</span>
                                <span className='text-sm text-gray-700'>Enthusiastic Reader</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center gap-2 w-full lg:w-[30%] bg-dominant rounded-xl flex-col p-5'>
                        <div className='flex justify-center items-center gap-2'>
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                            <Star size={15} fill='#ffb433' />
                        </div>
                        <p className='text-gray-700 text-center text-sm sm:text-base'>"I've been using Inkpulse for a year now, and it's helped me develope a consistent writting habit. The community is supportive, and the platform's features make publishing my work a breeze."</p>
                        <div className='flex justify-center items-center gap-3 mt-2'>
                            <Image src={'/raj.jpeg'} alt='raj' width={48} height={48} className='rounded-full' />
                            <div className='flex justify-center items-center flex-col'>
                                <span className='font-medium'>Raj Patel</span>
                                <span className='text-sm text-gray-700'>Sci-Fi Author</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <Footer/>
        </main>
    )
}

export default UnauthenticatedHome