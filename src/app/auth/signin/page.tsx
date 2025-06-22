"use client";
import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { Eye, EyeClosed } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

const dancingScript = Dancing_Script({
    weight: "400",
    subsets: ["latin"],
});

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handleLogin = async () => {
        const loadingToast = toast.loading("Signing in...");
        try {
            setLoading(true);
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log("RESULT:", result);

            if (result?.ok && !result?.error) {
                const session = await getSession();
                toast.success("User logged in successfully", { id: loadingToast });

                if (session?.user.profileCompleted) {
                    router.push("/");
                } else {
                    router.push("/setup_profile");
                }
            } else {
                toast.error("Invalid credentials. Please try again.", { id: loadingToast });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Please try again.", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };


    const navigateWithSpinner = (path: string) => {
        setLoading(true);
        router.push(path);
    }

    return (
        <div
            className={`bg-dominant h-[90%] w-[90%] flex justify-center items-center rounded-3xl drop-shadow-[-10px_15px_15px] ${dancingScript.className} p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
            {loading && (<Spinner />)}
            <div className="w-[50%] h-[90%] bg-[#d9d9d9] rounded-3xl">
                <img
                    src="/Write.png"
                    alt="write"
                    className="rounded-3xl object-cover h-[100%] w-[100%]"
                />
            </div>
            <div className="h-[90%] w-[50%] flex justify-center items-center flex-col gap-5">
                <h1 className="text-4xl">Login</h1>
                <input
                    type="text"
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
                        {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <button
                    className="w-[70%] bg-secondary rounded-full h-[10%] text-2xl outline-none"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <span className="text-lg">New user? <button className="text-blue-600 underline" onClick={() => navigateWithSpinner("/auth/register")}>Register</button></span>
                <div className="flex justify-center items-center gap-2 w-full">
                    <hr className="h-[2px] w-[30%] bg-black" />
                    <span>Or</span>
                    <hr className="h-[2px] w-[30%] bg-black" />
                </div>
                <button
                    className="w-[70%] bg-secondary rounded-full h-[10%] text-2xl outline-none flex justify-center items-center gap-5"
                    onClick={() => signIn("google")}
                >
                    <img src="/google-icon-logo-svgrepo-com.svg" className="w-7 h-7" alt="Google" />
                    Continue With Google
                </button>
            </div>
        </div>
    );
};

export default SignInPage;
