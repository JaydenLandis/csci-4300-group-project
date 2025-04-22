"use client";

import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { doCredentialLogin } from "../actions";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const response = await doCredentialLogin(formData);

      if (response?.error) {
        console.error(response.error);
        setError(response.error.message || "An error occurred");
      } else {
        router.push("/");
      }
    } catch (e: any) {
      console.error(e);
      setError("Check your Credentials");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?
          <Link href="/register" className="text-blue-600 hover:underline ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
