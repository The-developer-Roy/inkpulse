import React from 'react';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({
    weight: "400",
    subsets: ["latin"],
});

const Spinner = () => {
    return (
        <div className={`absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 rounded-3xl ${dancingScript.className}`}>
            <div className="flex space-x-1 text-xl font-bold text-black">
              <span className="animate-bounce delay-[0ms]">I</span>
              <span className="animate-bounce delay-[100ms]">n</span>
              <span className="animate-bounce delay-[200ms]">k</span>
              <span className="animate-bounce delay-[300ms]">p</span>
              <span className="animate-bounce delay-[400ms]">u</span>
              <span className="animate-bounce delay-[500ms]">l</span>
              <span className="animate-bounce delay-[600ms]">s</span>
              <span className="animate-bounce delay-[700ms]">e</span>
            </div>
        </div>
    )
}

export default Spinner
