// src/app/auth/signin/page.tsx

"use client";

import { signIn } from "next-auth/react";

const SignInPage = () => {
  const handleLogin = (provider: string) => {
    signIn(provider);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        {/* Login with Email and Password */}
        <form method="post" action="/api/auth/callback/credentials" className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-center mb-4">
          <span className="text-gray-500 text-sm">or sign in with</span>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleLogin("google")}
            className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded shadow"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
