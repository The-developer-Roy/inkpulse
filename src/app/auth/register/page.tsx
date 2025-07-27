"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

const dancingScript = Dancing_Script({
    weight: "400",
    subsets: ["latin"],
});

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            toast.error("Please fill up all fields");
            return;
        }

        const loadingToast = toast.loading("Signing up...");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Signup successful! Please login.", { id: loadingToast });
                router.push("/auth/signin");
            } else {
                toast.error(data.message || "Signup failed.", { id: loadingToast });
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Signup failed. Please try again.", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    }

    return (
        <div className={`bg-dominant h-[95vh] sm:h-[90%] w-[95vw] sm:w-[90%] flex flex-col lg:flex-row justify-center items-center rounded-2xl sm:rounded-3xl drop-shadow-[-10px_15px_15px] ${dancingScript.className} p-3 sm:p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>
            {loading && (<Spinner />)}

            {/* Image Section - Hidden on mobile, visible on large screens */}
            <div className="hidden lg:block w-[50%] h-[90%] bg-[#d9d9d9] rounded-3xl">
                <img
                    src="/Write.png"
                    alt="write"
                    className="rounded-3xl object-cover h-[100%] w-[100%]"
                />
            </div>

            {/* Form Section */}
            <div className="h-full w-full lg:h-[90%] lg:w-[50%] flex justify-center items-center flex-col gap-4 sm:gap-5 px-4 sm:px-0">
                <h1 className="text-3xl sm:text-4xl mb-2 sm:mb-0">Register</h1>

                <input
                    type="text"
                    placeholder="Enter Your Name..."
                    className="p-3 sm:p-2 w-[90%] sm:w-[70%] h-12 sm:h-[10%] rounded-md placeholder:text-[#959595] outline-none text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Enter Your Email..."
                    className="p-3 sm:p-2 w-[90%] sm:w-[70%] h-12 sm:h-[10%] rounded-md placeholder:text-[#959595] outline-none text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative w-[90%] sm:w-[70%] h-12 sm:h-[10%]">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Your Password..."
                        className="p-3 sm:p-2 w-full h-full rounded-md placeholder:text-[#959595] outline-none text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <button
                    className="w-[90%] sm:w-[70%] bg-secondary rounded-full h-12 sm:h-[10%] text-xl sm:text-2xl outline-none hover:bg-[#ebad42] transition-all duration-200"
                    onClick={handleRegister}
                >
                    Register
                </button>

                <div className="flex justify-center items-center gap-2 w-[90%] sm:w-full">
                    <hr className="h-[2px] w-[30%] bg-black" />
                    <span className="text-sm sm:text-base">Or</span>
                    <hr className="h-[2px] w-[30%] bg-black" />
                </div>

                <button
                    className="w-[90%] sm:w-[70%] bg-secondary rounded-full h-12 sm:h-[10%] text-lg sm:text-2xl outline-none flex justify-center items-center gap-3 sm:gap-5 hover:bg-[#ebad42] transition-all duration-200"
                    onClick={() => navigateWithSpinner("/auth/signin")}
                >
                    <span className="text-center">Already have an account? Login</span>
                </button>
            </div>
        </div>
    );
};

export default SignUpPage;