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
        } finally{
            setLoading(false);
        }
    };

    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    }

    return (
        <div className={`bg-dominant h-[90%] w-[90%] flex justify-center items-center rounded-3xl drop-shadow-[-10px_15px_15px] ${dancingScript.className} p-5`}>
            {loading && (<Spinner/>)}
            <div className="w-[50%] h-[90%] bg-[#d9d9d9] rounded-3xl">
                <img
                    src="/Write.png"
                    alt="write"
                    className="rounded-3xl object-cover h-[100%] w-[100%]"
                />
            </div>

            <div className="h-[90%] w-[50%] flex justify-center items-center flex-col gap-5">
                <h1 className="text-4xl">Register</h1>

                <input
                    type="text"
                    placeholder="Enter Your Name..."
                    className="p-2 w-[70%] h-[10%] rounded-md placeholder:text-[#959595] outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Enter Your Email..."
                    className="p-2 w-[70%] h-[10%] rounded-md placeholder:text-[#959595] outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative w-[70%] h-[10%]">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Your Password..."
                        className="p-2 w-full h-full rounded-md placeholder:text-[#959595] outline-none"
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
                    className="w-[70%] bg-secondary rounded-full h-[10%] text-2xl outline-none hover:bg-[#ebad42]"
                    onClick={handleRegister}
                >
                    Register
                </button>

                <div className="flex justify-center items-center gap-2 w-full">
                    <hr className="h-[2px] w-[30%] bg-black" />
                    <span>Or</span>
                    <hr className="h-[2px] w-[30%] bg-black" />
                </div>

                <button
                    className="w-[70%] bg-secondary rounded-full h-[10%] text-2xl outline-none flex justify-center items-center gap-5 hover:bg-[#ebad42]"
                    onClick={() => navigateWithSpinner("/auth/signin")}
                >
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
};

export default SignUpPage;
