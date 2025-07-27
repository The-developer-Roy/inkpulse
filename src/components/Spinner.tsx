import React from 'react';

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
    const letters = ['I', 'n', 'k', 'p', 'u', 'l', 's', 'e'];

    return (
        <div className={`absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 rounded-3xl ${className}`}>
            <div className="flex flex-col items-center space-y-4">

                {/* Simple spinning circle */}
                <div className="relative">
                    <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-2 w-8 h-8 border-2 border-transparent border-b-white/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>

                {/* Optimized text animation */}
                <div className="flex space-x-1" style={{ fontFamily: '"Dancing Script", cursive' }}>
                    {letters.map((letter, index) => (
                        <span
                            key={index}
                            className="text-2xl font-bold text-white animate-bounce"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animationDuration: '1.5s'
                            }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>

                {/* Simple dots */}
                <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-white/70 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 200}ms` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Spinner;